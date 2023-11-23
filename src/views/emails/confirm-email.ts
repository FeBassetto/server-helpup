interface Props {
  siteurl: string
  logo: string
  link: string
}

export function generateConfirmationEmailHtml({ siteurl, logo, link }: Props) {
  return `
    <html lang='en'>
      <head>
        <meta charset='utf-8' />
        <meta http-equiv='x-ua-compatible' content='ie=edge' />
        <title>Email Confirmation</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style type='text/css'>
          body, table, td, a { -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust:100%; } img { -ms-interpolation-mode: bicubic; }
          table { border-collapse: collapse !important; } a { color: #1a82e2;
          text-decoration: none; } img { height: auto; line-height: 100%; border: 0;
          outline: none; }
        </style>
      </head>
      <body style='background-color: #e1dfff; margin: 0; padding: 0 0 40px 0;'>
        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
          <tr>
            <td align='center' bgcolor='#e1dfff'>
              <table
                border='0'
                cellpadding='0'
                cellspacing='0'
                width='100%'
                style='max-width: 600px;'
              >
                <tr>
                  <td align='center' valign='top' style='padding: 36px 24px;'>
                    <a
                      href='${siteurl}'
                      target='_blank'
                      style='display: inline-block;'
                    >
                      <img
                        src='${logo}'
                        alt='Logo'
                        width='150'
                        style='display: block; width: 150px; max-width: 100%;'
                      />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align='center' bgcolor='#e1dfff'>
              <table
                border='0'
                cellpadding='0'
                cellspacing='0'
                width='100%'
                style='max-width: 600px;'
              >
                <tr>
                  <td
                    align='left'
                    bgcolor='#ffffff'
                    style='
                      padding: 36px 24px 0;
                      font-family: Helvetica, Arial, sans-serif;
                      border-top: 3px solid #d4dadf;
                    '
                  >
                    <h1
                      style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'
                    >
                      Confirme seu endereço de e-mail
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align='center' bgcolor='#e1dfff'>
              <table
                border='0'
                cellpadding='0'
                cellspacing='0'
                width='100%'
                style='max-width: 600px;'
              >
                <tr>
                  <td
                    align='left'
                    bgcolor='#ffffff'
                    style='
                      padding: 24px;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      line-height: 24px;
                    '
                  >
                    <p style='margin: 0;'>
                      Toque no botão abaixo para confirmar seu endereço de e-mail.
                      Se você não criou uma conta com a
                      <span style='color: #6c63ff;'>Help Up</span>, pode excluir
                      este e-mail com segurança.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align='left' bgcolor='#ffffff'>
                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                      <tr>
                        <td align='center' bgcolor='#ffffff' style='padding: 12px;'>
                          <table border='0' cellpadding='0' cellspacing='0'>
                            <tr>
                              <td
                                align='center'
                                bgcolor='#6c63ff'
                                style='border-radius: 6px;'
                              >
                                <a
                                  href='${link}'
                                  target='_blank'
                                  style='
                                    display: inline-block;
                                    padding: 16px 36px;
                                    font-family: Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    color: #ffffff;
                                    border-radius: 6px;
                                  '
                                >Confirmar Email</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align='left'
                    bgcolor='#ffffff'
                    style='
                      padding: 24px;
                      text-align: center;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      line-height: 24px;
                    '
                  >
                    <p style='margin: 0;'>
                      Se isso não funcionar, copie e cole o seguinte link em seu
                      navegador:
                    </p>
                    <p style='margin: 0;'>
                      <a href='${link}' target='_blank'>${link}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    align='left'
                    bgcolor='#ffffff'
                    style='
                      padding: 24px;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      line-height: 24px;
                      border-bottom: 3px solid #d4dadf;
                    '
                  >
                    <p style='margin: 0;'>
                      Até logo,<br />
                      <strong>Help Up</strong>
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
