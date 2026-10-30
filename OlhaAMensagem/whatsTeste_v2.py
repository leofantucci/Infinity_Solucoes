import configparser
import os
import random
import shutil
import time
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

LIMITE_LEGENDA = 1000

SELETOR_CAIXA_MENSAGEM = [
    (By.XPATH, "//footer//div[@contenteditable='true']"),
    (By.XPATH, "//div[@role='textbox' and @contenteditable='true']"),
]

SELETOR_BOTAO_ANEXO = [
    (By.CSS_SELECTOR, 'button[title="Anexar"]'),
    (By.CSS_SELECTOR, 'button[aria-label="Anexar"]'),
    (By.CSS_SELECTOR, 'button[title="Attach"]'),
    (By.CSS_SELECTOR, 'button[aria-label="Attach"]'),
    (By.CSS_SELECTOR, 'button[title="Adjuntar"]'),
    (By.CSS_SELECTOR, 'button[aria-label="Adjuntar"]'),
    (By.CSS_SELECTOR, 'button[data-testid="attach-btn"]'),
    (By.CSS_SELECTOR, 'span[data-icon="plus"]'),
    (By.CSS_SELECTOR, 'span[data-icon="clip"]'),
]

SELETOR_INPUT_IMAGEM = [
    (By.CSS_SELECTOR, 'input[type="file"][accept*="image"]'),
    (By.CSS_SELECTOR, 'input[type="file"]'),
]

SELETOR_OPCAO_FOTOS = [
    (By.XPATH, "//*[normalize-space()='Fotos e vídeos']"),
    (By.XPATH, "//*[normalize-space()='Photos & videos']"),
    (By.XPATH, "//*[normalize-space()='Fotos y videos']"),
]

SELETOR_LEGENDA = [
    (
        By.XPATH,
        "//div[@contenteditable='true'][@aria-placeholder='Adicione uma legenda']",
    ),
    (
        By.XPATH,
        "//div[@contenteditable='true'][@aria-placeholder='Add a caption']",
    ),
    (
        By.XPATH,
        "//div[@contenteditable='true'][@aria-label='Adicione uma legenda']",
    ),
    (
        By.XPATH,
        "//div[@contenteditable='true'][@aria-label='Add a caption']",
    ),
    (
        By.XPATH,
        "//div[@contenteditable='true' and not(ancestor::footer)]",
    ),
]

SELETOR_BOTAO_ENVIAR = [
    (By.CSS_SELECTOR, 'button[aria-label="Enviar"]'),
    (By.CSS_SELECTOR, 'button[aria-label="Send"]'),
    (By.CSS_SELECTOR, 'button[aria-label="Enviar mensagem"]'),
    (By.CSS_SELECTOR, 'div[role="button"][aria-label="Enviar"]'),
    (By.CSS_SELECTOR, 'div[role="button"][aria-label="Send"]'),
    (By.CSS_SELECTOR, 'button[data-testid="send"]'),
    (By.CSS_SELECTOR, 'span[data-icon="send"]'),
]

SELETOR_NUMERO_SEM_WHATSAPP = [
    (By.XPATH, "//div[@role='dialog']//*[contains(text(), 'inválido')]"),
    (By.XPATH, "//div[@role='dialog']//*[contains(text(), 'inválida')]"),
    (By.XPATH, "//div[@role='dialog']//*[contains(text(), 'invalid')]"),
    (By.XPATH, "//div[@role='dialog']//*[contains(text(), 'não está no WhatsApp')]"),
    (By.XPATH, "//div[@role='dialog']//*[contains(text(), 'not on WhatsApp')]"),
]

SELETOR_BOTAO_OK = [
    (
        By.XPATH,
        "//div[@role='dialog']//button[normalize-space()='OK' or normalize-space()='Ok']",
    ),
    (
        By.XPATH,
        "//div[@role='dialog']//*[@role='button'][normalize-space()='OK' or normalize-space()='Ok']",
    ),
    (By.XPATH, "//div[@role='dialog']//button"),
    (By.XPATH, "//div[@role='dialog']//*[@role='button']"),
]


def bases_firefox():
    home = Path.home()
    xdg_config = os.environ.get("XDG_CONFIG_HOME")

    candidatos = []

    if xdg_config:
        candidatos.append(Path(xdg_config) / "mozilla" / "firefox")

    candidatos.extend(
        [
            home / ".config" / "mozilla" / "firefox",
            home / ".mozilla" / "firefox",
            home / "snap" / "firefox" / "common" / ".mozilla" / "firefox",
            home / ".var" / "app" / "org.mozilla.firefox" / ".mozilla" / "firefox",
        ]
    )

    bases = []
    vistos = set()

    for base in candidatos:
        chave = str(base)

        if chave not in vistos and base.is_dir():
            vistos.add(chave)
            bases.append(base)

    return bases


def ler_profiles_ini(base):
    caminho_ini = base / "profiles.ini"

    if not caminho_ini.is_file():
        return None, []

    parser = configparser.ConfigParser(interpolation=None)

    try:
        parser.read(caminho_ini, encoding="utf-8")
    except configparser.Error:
        return None, []

    padrao_instalacao = None

    for secao in parser.sections():
        if secao.startswith("Install"):
            padrao_instalacao = parser.get(secao, "Default", fallback=None)

            if padrao_instalacao:
                break

    perfis = []

    for secao in parser.sections():
        if not secao.startswith("Profile"):
            continue

        caminho = parser.get(secao, "Path", fallback="").strip()

        if not caminho:
            continue

        relativo = parser.get(secao, "IsRelative", fallback="1").strip() != "0"
        perfil = base / caminho if relativo else Path(caminho)
        padrao = parser.get(secao, "Default", fallback="0").strip() in (
            "1",
            "true",
            "True",
        )
        perfis.append((perfil, padrao))

    return padrao_instalacao, perfis


def encontrar_perfil_firefox():
    for base in bases_firefox():
        padrao_instalacao, perfis = ler_profiles_ini(base)

        if padrao_instalacao:
            nome = Path(padrao_instalacao).name

            for perfil, _ in perfis:
                if perfil.name == nome and perfil.is_dir():
                    return perfil

        for perfil, padrao in perfis:
            if padrao and perfil.is_dir():
                return perfil

        for perfil, _ in perfis:
            if "default-release" in perfil.name and perfil.is_dir():
                return perfil

        for perfil, _ in perfis:
            if perfil.is_dir():
                return perfil

    return None


def pasta_dados():
    xdg_data = os.environ.get("XDG_DATA_HOME")
    base = Path(xdg_data) if xdg_data else Path.home() / ".local" / "share"
    return base / "olha-a-mensagem"


def perfil_automacao():
    return pasta_dados() / "firefox_profile"


def marcador_perfil():
    return perfil_automacao() / ".olha-mensagem-pronto"


def copiar_dados_firefox(origem, destino):
    destino.mkdir(parents=True, exist_ok=True)

    for nome in [
        "cookies.sqlite",
        "cookies.sqlite-wal",
        "cert9.db",
        "key4.db",
        "pkcs11.txt",
        "permissions.sqlite",
        "prefs.js",
        "handlers.json",
    ]:
        arquivo = origem / nome

        if arquivo.is_file():
            shutil.copy2(arquivo, destino / nome)

    origem_whatsapp = (
        origem / "storage" / "default" / "https+++web.whatsapp.com"
    )

    if origem_whatsapp.is_dir():
        shutil.copytree(
            origem_whatsapp,
            destino / "storage" / "default" / origem_whatsapp.name,
            dirs_exist_ok=True,
            ignore=shutil.ignore_patterns(
                "lock",
                ".parentlock",
                "parent.lock",
            ),
        )

    for base in (origem / "storage" / "default").glob(
        "https+++*whatsapp.net*"
    ):
        shutil.copytree(
            base,
            destino / "storage" / "default" / base.name,
            dirs_exist_ok=True,
        )


def preparar_perfil_automacao():
    perfil = perfil_automacao()

    if marcador_perfil().is_file():
        return perfil

    origem = encontrar_perfil_firefox()

    if origem is None:
        print(
            "Perfil padrão do Firefox não encontrado. "
            "Será necessário escanear o QR code uma vez."
        )
    else:
        print(
            "Preparando o perfil de automação do Firefox "
            "(somente na primeira execução)..."
        )

        try:
            copiar_dados_firefox(origem, perfil)
            print("Perfil de automação preparado com os dados do Firefox.")
        except Exception as erro:
            print(
                f"Não foi possível copiar todos os dados do Firefox: {erro}"
            )
            print("Será necessário escanear o QR code uma vez.")

    marcador_perfil().parent.mkdir(parents=True, exist_ok=True)
    marcador_perfil().write_text("ok", encoding="utf-8")

    return perfil


def criar_driver():
    perfil = preparar_perfil_automacao()

    print(f"Usando o perfil de automação do Firefox: {perfil}")

    options = Options()
    options.add_argument("-profile")
    options.add_argument(str(perfil))

    driver = webdriver.Firefox(options=options)
    driver.maximize_window()
    return driver


def gerar_tempo():
    return random.uniform(1.0, 3.5)


def gerar_tempo_envio():
    return random.uniform(3.5, 5.0)

def gerar_tempo_digitacao():
    return random.uniform(0.028, 0.15)


def garantir_sessao(driver):
    driver.get("https://web.whatsapp.com")

    try:
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#pane-side"))
        )
        return
    except TimeoutException:
        pass

    print("Se aparecer o QR code, escaneie com o WhatsApp do seu celular.")
    print("O login fica salvo no perfil de automação para as próximas execuções.")

    try:
        WebDriverWait(driver, 180).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#pane-side"))
        )
    except TimeoutException as erro:
        raise RuntimeError(
            "Login no WhatsApp Web não concluído."
        ) from erro


def esperar(driver, seletores, timeout=20, visivel=True):
    condicoes = []

    for by, seletor in seletores:
        if visivel:
            condicoes.append(EC.visibility_of_element_located((by, seletor)))
        else:
            condicoes.append(EC.presence_of_element_located((by, seletor)))

    return WebDriverWait(driver, timeout).until(EC.any_of(*condicoes))


def clicar(driver, elemento):
    try:
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", elemento)
        time.sleep(0.3)
        elemento.click()
    except WebDriverException:
        try:
            driver.execute_script(
                "const alvo = arguments[0].closest('button, [role=\"button\"]') "
                "|| arguments[0]; alvo.click();",
                elemento,
            )
        except Exception:
            driver.execute_script("arguments[0].click();", elemento)


def obter_caixa_mensagem(driver):
    """Retorna a caixa de mensagem visível no rodapé da conversa."""
    seletores = [
        (By.XPATH, "//footer//div[@contenteditable='true' and @role='textbox']"),
        (By.XPATH, "//footer//*[@contenteditable='true']"),
        (By.XPATH, "//div[@contenteditable='true' and @role='textbox']"),
    ]

    ultimo_erro = None
    for by, seletor in seletores:
        try:
            elementos = WebDriverWait(driver, 20).until(
                EC.presence_of_all_elements_located((by, seletor))
            )
            visiveis = [elemento for elemento in elementos if elemento.is_displayed() and elemento.is_enabled()]
            if visiveis:
                return visiveis[-1]
        except TimeoutException as erro:
            ultimo_erro = erro

    raise TimeoutException(
        "Não encontrei a caixa de mensagem da conversa."
    ) from ultimo_erro


def caixa_conversa_visivel(driver):
    """Retorna a caixa de mensagem se ela já estiver visível, sem esperar."""
    for by, seletor in SELETOR_CAIXA_MENSAGEM:
        for elemento in driver.find_elements(by, seletor):
            if elemento.is_displayed() and elemento.is_enabled():
                return elemento

    return None


def numero_sem_whatsapp(driver):
    """Retorna o aviso de número inválido/sem WhatsApp, se estiver visível."""
    for by, seletor in SELETOR_NUMERO_SEM_WHATSAPP:
        for elemento in driver.find_elements(by, seletor):
            if elemento.is_displayed():
                return elemento

    return None


def fechar_aviso_numero_invalido(driver):
    """Fecha o diálogo de número inválido/sem WhatsApp."""
    try:
        elemento = encontrar_elemento(driver, SELETOR_BOTAO_OK, timeout=5)
        clicar(driver, elemento)
    except Exception:
        pass


def abrir_conversa(driver, telefone, timeout=25):
    """
    Abre a conversa do telefone e informa se ele está no WhatsApp.
    Retorna True se a conversa abriu, False se o número não está no
    WhatsApp e None se não foi possível confirmar.
    """
    driver.get("https://web.whatsapp.com/send?phone=" + telefone)

    try:
        WebDriverWait(driver, timeout, poll_frequency=0.5).until(
            lambda d: numero_sem_whatsapp(d) is not None
            or caixa_conversa_visivel(d) is not None
        )
    except TimeoutException:
        return None

    if numero_sem_whatsapp(driver) is not None:
        fechar_aviso_numero_invalido(driver)
        return False

    return True


def normalizar_texto(texto):
    """Normaliza espaços e quebras de linha para comparar o texto digitado."""
    texto = (texto or "").replace("\u00a0", " ")
    return " ".join(texto.split())


def texto_da_caixa(elemento):
    """
    Lê o conteúdo do editor usando mais de uma propriedade.
    O WhatsApp pode expor o texto de formas diferentes no contenteditable.
    """
    valores = [
        elemento.get_attribute("innerText"),
        elemento.get_attribute("textContent"),
        elemento.text,
    ]

    for valor in valores:
        if valor and valor.strip():
            return valor

    return ""

def digitar_mensagem(driver, mensagem):
    limpar_caixa_mensagem(driver)
    
    mensagem = str(mensagem).strip()

    if not mensagem:
        raise ValueError("A mensagem está vazia.")

    caixa = obter_caixa_mensagem(driver)
    caixa.click()

    # Digita o texto sem enviar antes da validação.
    for letra in mensagem:
        if letra == "\n":
            caixa.send_keys(Keys.SHIFT, Keys.ENTER)
        else:
            caixa.send_keys(letra)

        time.sleep(gerar_tempo_digitacao())

    # Aguarda o editor apresentar o texto completo.
    esperado = normalizar_texto(mensagem)

    try:
        WebDriverWait(driver, 10).until(
            lambda d: normalizar_texto(
                texto_da_caixa(obter_caixa_mensagem(d))
            ) == esperado
        )
    except TimeoutException as erro:
        raise RuntimeError(
            "O texto digitado está incompleto. "
            "A mensagem não foi enviada."
        ) from erro

    # Só envia depois da validação.
    caixa = obter_caixa_mensagem(driver)
    caixa.send_keys(Keys.ENTER)

    time.sleep(gerar_tempo_envio())

    print("Mensagem enviada.")

def encontrar_elemento(driver, seletores, timeout=15, visivel=True):
    condicoes = []
    for by, seletor in seletores:
        if visivel:
            condicoes.append(EC.visibility_of_element_located((by, seletor)))
        else:
            condicoes.append(EC.presence_of_element_located((by, seletor)))
    return WebDriverWait(driver, timeout).until(EC.any_of(*condicoes))

def limpar_caixa_mensagem(driver):
    caixa = obter_caixa_mensagem(driver)
    caixa.click()
    caixa.send_keys(Keys.CONTROL, "a")
    caixa.send_keys(Keys.BACKSPACE)
    time.sleep(gerar_tempo())

def high(mensagem, clientes):
    teste = "abc"
    print("Comprimento abc = " + str(len(teste)))
    driver = criar_driver()

    try:
        garantir_sessao(driver)

        for cliente in clientes:
            if len(cliente) < 2:
                continue

            nome = str(cliente[0]).strip()
            telefone = "".join(ch for ch in str(cliente[1]) if ch.isdigit())
            if not telefone:
                print("Linha ignorada: telefone vazio ou inválido.")
                continue
            
            print(f"\nAbrindo conversa com {nome} -> {telefone}")

            lista_enviados = str("Lista de clientes contatados:\n")
            try:
                status = abrir_conversa(driver, telefone)
                time.sleep(gerar_tempo())

                if status is False:
                    print(
                        f"O número {telefone} não está no WhatsApp. "
                        "Pulando..."
                    )
                    time.sleep(gerar_tempo())
                    continue

                if status is None:
                    print(
                        f"Não foi possível confirmar se {telefone} está no "
                        "WhatsApp. Pulando..."
                    )
                    time.sleep(gerar_tempo())
                    continue

                input("Aperte ENTER após enviar a foto...")
                print("Apertou!")

                time.sleep(gerar_tempo())
                try:
                    caixa = obter_caixa_mensagem(driver)
                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", caixa)
                    time.sleep(gerar_tempo())
                    try:
                        caixa.click()
                    except Exception:
                        driver.execute_script("arguments[0].click();", caixa)
                    time.sleep(gerar_tempo())
                except Exception:
                    pass

                if nome:
                    primeira_msg = f"Olá, {nome}! Tudo bem?"
                    digitar_mensagem(driver, primeira_msg)
                    time.sleep(gerar_tempo())

                digitar_mensagem(driver, mensagem)

                print(f"Mensagens enviadas para {telefone}.")
                lista_enviados += str(str(nome)+"\n")

            except Exception as erro:
                print(f"Erro ao processar {telefone}: {erro}")
                print("Confira a conversa no WhatsApp Web antes de executar novamente.")

            time.sleep(gerar_tempo())

    finally:
        print(str(lista_enviados))
        driver.quit()


def abrir_whats():
    driver = criar_driver()

    try:
        garantir_sessao(driver)
        print(f"\nAbrindo Whatsapp")
        try:
            driver.get("https://web.whatsapp.com/")
            input("Aperte ENTER para fechar!")
            print("Apertou!")
        except Exception as erro:
            print(f"Erro: {erro}")
        time.sleep(gerar_tempo())

    finally:
        driver.quit()