# Auditoria técnica R19

{
  "build": "R19",
  "checks": [
    {
      "id": "FORM-2026-0037",
      "units": 20,
      "passed": 20,
      "nominal": 84,
      "unique": 84,
      "forbidden": [],
      "responses": 0
    },
    {
      "id": "FORM-2026-0038",
      "units": 20,
      "passed": 20,
      "nominal": 84,
      "unique": 84,
      "forbidden": [],
      "responses": 0
    }
  ],
  "units": [
    {
      "unit": "Subdiretor",
      "count": 1
    },
    {
      "unit": "Gabinete - Secretaria",
      "count": 1
    },
    {
      "unit": "DAI/1",
      "count": 3
    },
    {
      "unit": "DAI/2 - Coordenação",
      "count": 1
    },
    {
      "unit": "DAI/2 - AFAS",
      "count": 1
    },
    {
      "unit": "DAI/2 - ALMG",
      "count": 2
    },
    {
      "unit": "DAI/2 - Intendência",
      "count": 6
    },
    {
      "unit": "DAI/2 - CEDEC",
      "count": 6
    },
    {
      "unit": "DAI/2 - CTPM",
      "count": 14
    },
    {
      "unit": "DAI/2 - GMG",
      "count": 8
    },
    {
      "unit": "DAI/2 - MPMG",
      "count": 6
    },
    {
      "unit": "DAI/2 - OGE",
      "count": 4
    },
    {
      "unit": "DAI/2 - SALVAR",
      "count": 5
    },
    {
      "unit": "DAI/2 - SEMAD/IEF",
      "count": 1
    },
    {
      "unit": "DAI/2 - SENASP/MJSP",
      "count": 1
    },
    {
      "unit": "DAI/2 - TJMG",
      "count": 6
    },
    {
      "unit": "DAI/2 - TJMMG",
      "count": 8
    },
    {
      "unit": "DAI/3",
      "count": 4
    },
    {
      "unit": "ASPAR",
      "count": 1
    },
    {
      "unit": "AEST",
      "count": 5
    }
  ],
  "source": "Cabeçalhos reais das planilhas de respostas e configuração da Factory",
  "limits": [
    "Sem teste de submissão real: registros oficiais não foram contaminados.",
    "Sem autenticação própria de chefia e sem bloqueio de duplicidade pelo Forms.",
    "Justificativas individuais em campo textual; integração nativa embutida, não formulário HTML próprio.",
    "Acesso DNS ao site público indisponível no ambiente de execução.",
    "5 nomes preliminares da AEST precisam de conferência; 6 registros sem confirmação excluídos da lista, complemento disponível."
  ]
}
