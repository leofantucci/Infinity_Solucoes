import base64
import csv
import os
import re
import time
import tkinter as tk
from tkinter import filedialog
import sys

import resend
from dotenv import load_dotenv

from whatsTeste_v2 import high, abrir_whats, preparar_perfil_automacao

load_dotenv()

api_key = os.getenv("RESEND_API_KEY")

if not api_key:
    raise RuntimeError("RESEND_API_KEY não encontrada no arquivo .env")

resend.api_key = api_key

PASTA_ATUAL = os.path.dirname(os.path.abspath(__file__))
CAMINHO_IMAGEM = os.path.join(PASTA_ATUAL, "arte_LAF_Sites.png")

REMETENTE = "LAF Soluções Empresariais <contato@lafsolucoes.xyz>"
RESPONDER_PARA = "sejaluzluminarias3d@gmail.com"
ASSUNTO = "Faça seu site, com sua cara!"

REGEX_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
CABECALHOS = {
    "nome",
    "name",
    "cliente",
    "client",
    "telefone",
    "phone",
    "whatsapp",
    "email",
    "e-mail",
}

_root = None


def obter_root():
    global _root
    if _root is None:
        _root = tk.Tk()
        _root.withdraw()
    return _root


def limpar_tela():
    os.system("cls" if os.name == "nt" else "clear")


def printar_cabecalho():
    print("########################")
    print("OLHA-A-MENSAGEM.app - v0")
    print("########################\n")


def pausar(mensagem="Pressione ENTER para continuar..."):
    input(mensagem)


def filtrar_numero(numero):
    # Mantém somente os números, incluindo o código do país.
    return re.sub(r"\D", "", str(numero))


def e_cabecalho(linha):
    return any(celula.strip().lower() in CABECALHOS for celula in linha[:3])

def detectar_delimitador(caminho):
    with open(caminho, "r", encoding="utf-8-sig", newline="") as arquivo:
        amostra = arquivo.read(4096)

    # Primeiro tenta os delimitadores convencionais.
    try:
        return csv.Sniffer().sniff(
            amostra,
            delimiters=",;\t"
        ).delimiter
    except csv.Error:
        # Arquivo com colunas separadas por espaços.
        return " "


def carregar_clientes(caminho):
    delimitador = detectar_delimitador(caminho)
    clientes = []

    with open(caminho, "r", encoding="utf-8-sig", newline="") as arquivo:
        leitor = csv.reader(
            arquivo,
            delimiter=delimitador,
            skipinitialspace=True
        )

        for numero_linha, linha in enumerate(leitor, start=1):
            linha = [celula.strip() for celula in linha]

            if not any(linha):
                continue

            if numero_linha == 1 and e_cabecalho(linha):
                continue

            clientes.append(linha)

    return clientes


def carregar_clientes(caminho):
    delimitador = detectar_delimitador(caminho)
    clientes = []

    with open(caminho, "r", encoding="utf-8-sig", newline="") as arquivo:
        leitor = csv.reader(arquivo, delimiter=delimitador)

        for numero_linha, linha in enumerate(leitor, start=1):
            linha = [celula.strip() for celula in linha]

            if not any(linha):
                continue

            if numero_linha == 1 and e_cabecalho(linha):
                continue

            clientes.append(linha)

    return clientes


def escolher_arquivo(titulo, tipos):
    root = obter_root()
    root.attributes("-topmost", True)

    try:
        arquivo = filedialog.askopenfilename(title=titulo, filetypes=tipos)
    finally:
        root.attributes("-topmost", False)

    if arquivo:
        print("Arquivo selecionado:", arquivo, "\n")
        return arquivo

    print("Nenhum arquivo selecionado.\n")
    return None


def escolher_mensagem():
    caminho = escolher_arquivo(
        "Selecione o arquivo da mensagem (.txt)",
        [("Arquivos de texto", "*.txt"), ("Todos os arquivos", "*.*")],
    )

    if caminho is None:
        return None

    with open(caminho, "r", encoding="utf-8") as arquivo:
        texto = arquivo.read().strip()

    if not texto:
        print("O arquivo de mensagem está vazio.")
        pausar()
        return None

    return texto


def escolher_clientes(titulo="Selecione o arquivo .CSV com os clientes"):
    caminho = escolher_arquivo(
        titulo,
        [("Arquivos CSV", "*.csv"), ("Todos os arquivos", "*.*")],
    )

    if caminho is None:
        return None, None

    clientes = carregar_clientes(caminho)

    if not clientes:
        print("Nenhum cliente encontrado no CSV.")
        pausar()
        return None, None

    return caminho, clientes


def menu():
    while True:
        limpar_tela()
        printar_cabecalho()

        print("0 - Abrir Whatsapp")
        print("1 - Enviar por E-mail")
        print("2 - Enviar por WhatsApp")
        print("9 - Sair\n")

        try:
            escolha_menu = int(input("Escolha a opção desejada: "))
        except (ValueError, EOFError):
            print("\nInsira uma opção válida!")
            pausar()
            continue

        match escolha_menu:
            case 0:
                abrir_whats()
            case 1:
                enviar_email()
            case 2:
                enviar_whats()
            case 9:
                limpar_tela()
                print("Até a próxima!")
                break
            case _:
                print("\nInsira uma opção válida!")
                pausar()


def enviar_email():
    limpar_tela()
    printar_cabecalho()
    print("ENVIO POR E-MAIL\n")
    print("1° passo: selecionar a mensagem a ser enviada")
    pausar()

    texto = escolher_mensagem()

    if texto is None:
        return

    print("2° passo: selecionar o .CSV com os clientes")
    pausar()

    caminho_csv, clientes = escolher_clientes()

    if caminho_csv is None:
        return

    destinatarios = []
    invalidos = 0

    for cliente in clientes:
        if len(cliente) < 3 or not REGEX_EMAIL.match(cliente[2]):
            invalidos += 1
            continue

        destinatarios.append(cliente[2])

    destinatarios = list(dict.fromkeys(destinatarios))

    if not destinatarios:
        print("Nenhum e-mail válido encontrado no CSV.")
        pausar()
        return

    limpar_tela()
    printar_cabecalho()
    print("CONFIRMANDO O ENVIO...\n")
    print("Mensagem:\n")
    print(texto)
    print(f"\nDestinatários válidos: {len(destinatarios)}")
    for d in destinatarios:
        print(d)
    if invalidos:
        print(f"Linhas ignoradas (sem e-mail válido): {invalidos}")

    print("\nImagem que será anexada:", CAMINHO_IMAGEM)

    if not os.path.isfile(CAMINHO_IMAGEM):
        print("\nERRO: o arquivo arte_LAF_Sites.png não foi encontrado.")
        pausar()
        return

    confirmacao = input("\nDeseja iniciar o envio? (s/n): ").strip().lower()

    if confirmacao != "s":
        print("Operação cancelada.")
        pausar()
        return

    with open(CAMINHO_IMAGEM, "rb") as imagem:
        imagem_base64 = base64.b64encode(imagem.read()).decode("utf-8")

    limpar_tela()
    printar_cabecalho()
    print(f"Enviando {len(destinatarios)} e-mail(s)...\n")

    enviados = 0
    falhas = 0

    for indice, email_destino in enumerate(destinatarios, start=1):
        try:
            resposta = resend.Emails.send(
                {
                    "from": REMETENTE,
                    "reply_to": RESPONDER_PARA,
                    "to": [email_destino],
                    "subject": ASSUNTO,
                    "text": texto,
                    "attachments": [
                        {
                            "filename": "arte_LAF_Sites.png",
                            "content": imagem_base64,
                            "content_type": "image/png",
                        }
                    ],
                }
            )

            enviados += 1
            print(
                f"[{indice}/{len(destinatarios)}] Enviado para "
                f"{email_destino} (ID: {resposta.get('id', 'n/d')})"
            )
        except Exception as erro:
            falhas += 1
            print(
                f"[{indice}/{len(destinatarios)}] Erro ao enviar para "
                f"{email_destino}: {erro}"
            )

        if indice < len(destinatarios):
            time.sleep(1.0)

    print(f"\nResumo: {enviados} enviado(s), {falhas} falha(s).")
    pausar()


def enviar_whats():
    limpar_tela()
    printar_cabecalho()
    print("ENVIO POR WHATSAPP\n")
    print("1° passo: selecionar a mensagem a ser enviada")
    pausar()

    texto = escolher_mensagem()

    if texto is None:
        return

    print("2° passo: selecionar o .CSV com os clientes")
    pausar()

    caminho_csv, clientes = escolher_clientes()

    if caminho_csv is None:
        return

    try:
        perfil_firefox = preparar_perfil_automacao()
    except Exception as erro:
        print(f"\nNão é possível preparar o Firefox: {erro}")
        pausar()
        return

    lista_clientes = []
    telefones_vistos = set()
    invalidos = 0

    for cliente in clientes:
        if len(cliente) < 2:
            invalidos += 1
            continue

        telefone = filtrar_numero(cliente[1])

        if len(telefone) < 8 or telefone in telefones_vistos:
            invalidos += 1
            continue

        telefones_vistos.add(telefone)
        cliente = list(cliente)
        cliente[1] = telefone
        lista_clientes.append(cliente)

    if not lista_clientes:
        print("Nenhum telefone válido encontrado no CSV.")
        pausar()
        return

    limpar_tela()
    printar_cabecalho()
    print("CONFIRMANDO O ENVIO...\n")
    print("Mensagem:\n")
    print(texto)
    print(f"\nClientes válidos: {len(lista_clientes)}")

    if invalidos:
        print(f"Linhas ignoradas (sem telefone válido ou duplicadas): {invalidos}")

    print("Perfil de automação do Firefox:", perfil_firefox)
    print("\nContatos:")

    for cliente in lista_clientes:
        nome = cliente[0] if cliente[0] else "sem nome"
        print(f"- {nome}: {cliente[1]}")

    confirmacao = input(
        "\nDeseja iniciar o envio pelo WhatsApp? (s/n): "
    ).strip().lower()

    if confirmacao != "s":
        print("Operação cancelada.")
        pausar()
        return

    limpar_tela()
    printar_cabecalho()
    print(f"Enviando para {len(lista_clientes)} cliente(s)...\n")

    try:
        high(texto, lista_clientes)
    except Exception as erro:
        print(f"Erro durante a automação do WhatsApp: {erro}")

    pausar("\nProcesso finalizado. Pressione ENTER para continuar...")


if __name__ == "__main__":
    try:
        if(len(sys.argv) > 2):
            os.chdir(sys.argv[1])

        menu()

    except KeyboardInterrupt:
        print("\n\nOperação interrompida.")
