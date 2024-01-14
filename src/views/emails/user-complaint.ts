interface UserComplaintProps {
  siteurl: string
  logo: string
  fullName: string
  email: string
  phoneNumber: string
  observations: string
}

export function generateUserComplaintEmailHtml({
  siteurl,
  logo,
  fullName,
  email,
  phoneNumber,
  observations,
}: UserComplaintProps) {
  return `
  <!doctype html>
  <html lang="pt">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <title>Reclamação de Usuário</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style type="text/css">
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        img {
          -ms-interpolation-mode: bicubic;
        }
        table {
          border-collapse: collapse !important;
        }
        a {
          color: #1a82e2;
          text-decoration: none;
        }
        img {
          height: auto;
          line-height: 100%;
          border: 0;
          outline: none;
          max-width: 100%;
        }
        td {
          max-width: 600px;
        }
        p {
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          max-width: 600px;
        }
      </style>
    </head>
    <body style="background-color: #e1dfff; margin: 0; padding: 0 0 40px 0">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="max-width: 600px; margin: 0 auto"
      >
        <tr>
          <td align="center" bgcolor="#e1dfff">
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="max-width: 600px"
            >
              <tr>
                <td align="center" valign="top" style="padding: 36px 24px">
                  <a
                    href="${siteurl}"
                    target="_blank"
                    style="display: inline-block"
                  >
                    <img
                      src="${logo}"
                      alt="Logo"
                      width="150"
                      height="auto"
                      style="
                        display: block;
                        width: 150px;
                        max-width: 100%;
                        max-height: auto;
                      "
                    />
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#e1dfff">
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="max-width: 600px"
            >
              <tr>
                <td
                  align="left"
                  bgcolor="#ffffff"
                  style="
                    padding: 36px 24px 0;
                    font-family: Helvetica, Arial, sans-serif;
                    border-top: 3px solid #d4dadf;
                  "
                >
                  <h1
                    style="
                      margin: 0;
                      font-size: 32px;
                      font-weight: 700;
                      letter-spacing: -1px;
                      line-height: 48px;
                      max-width: 600px;
                    "
                  >
                    Reclamação de Usuário
                  </h1>
                </td>
              </tr>
              <tr>
                <td
                  align="left"
                  bgcolor="#ffffff"
                  style="
                    padding: 24px;
                    font-family: Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    max-width: 600px;
                    word-break: break-word;
                  "
                >
                  <p style="margin: 0">
                    Recebemos uma reclamação de um usuário. Abaixo estão os detalhes fornecidos:
                  </p>
                  <p style="margin: 0; padding-top: 15px;"><strong>Nome Completo:</strong> ${fullName}</p>
                  <p style="margin: 0; padding-top: 5px;"><strong>E-mail:</strong> ${email}</p>
                  <p style="margin: 0; padding-top: 5px;"><strong>Celular:</strong> ${phoneNumber}</p>
                  <p style="margin: 0; padding-top: 5px;"><strong>Observações:</strong> ${observations}</p>
                </td>
              </tr>
              <tr>
                <td
                  align="left"
                  bgcolor="#ffffff"
                  style="
                    padding: 24px;
                    font-family: Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    border-bottom: 3px solid #d4dadf;
                    max-width: 600px;
                  "
                >
                  <p style="margin: 0">
                    Atenciosamente,<br />
                    <strong>Sua Equipe de Suporte</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
}
