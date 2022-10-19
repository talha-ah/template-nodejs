const { toTitleCase } = require("../utils/helpers")

function emailTemplate({ name, message, url, button }) {
  const textColor = "#000000"
  const background = "#ffffff"

  const buttonTextColor = "#ffffff"
  const buttonBackground = "#000000"

  const headerText = "#ffffff"
  const headerBackground = "#000000"

  const footerText = "#ffffff"
  const footerBackground = "#000000"

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>TEMPLATE</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
      <![endif]-->
      <style>
        body {
          margin: 0;
          padding: 0;
          color: ${textColor};
          font-family: "Nunito Sans", sans-serif;
        }
        .outer-table {
          border: 0;
          margin: 0;
          padding: 0;
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          background: ${background};
        }
        .table {
          border: 0;
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: 500px;
          border-spacing: 0;
          background: ${background};
          border-collapse: collapse;
        }
        .table-body {
          margin: 0;
          padding: 0;
          border: none;
        }
        .header {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 95px;
          background-color: ${headerBackground};
        }
        .header-text {
          margin: 0;
          font-size: 1.3em;
          color: ${headerText};
        }
        .body {
          margin: 0;
          padding: 50px;
        }
        .body-table {
          border: 0;
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
        }
        .body-user {
          margin: 0;
          padding: 0;
          color: ${textColor};
        }
        .body-message {
          margin: 0;
          padding: 0;
          margin: 20px 0;
          color: ${textColor};
        }
        .body-button-container {
          margin-top: 30px;
        }
        .body-button {
          cursor: pointer;
          text-align: center;
          border-radius: 5px;
          text-decoration: none;
          padding: 12px 20px 12px 20px;
          color: ${buttonTextColor} !important;
          background-color: ${buttonBackground};
        }
        .body-button:hover {
          text-decoration: underline;
        }
        .footer {
          width: 100%;
          padding: 20px 0;
          background-color: ${footerBackground};
        }
        .footer-table {
          border: 0;
          width: 100%;
          border-spacing: 0;
          background-color: ${footerBackground};
        }
        .footer-website {
          margin: 0;
          display: block;
          font-size: 15px;
          font-weight: 700;
          line-height: 20px;
          font-style: normal;
          text-align: center;
          margin-bottom: 6px;
          letter-spacing: 0em;
          text-decoration: none;
          font-family: Nunito Sans;
          color: ${footerText} !important;
        }
        .footer-website:hover {
          text-decoration: underline;
        }
        .footer-description {
          margin: 0;
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          font-style: normal;
          text-align: center;
          margin-bottom: 0px;
          letter-spacing: 0em;
          color: ${footerText};
          text-decoration: none;
          font-family: Nunito Sans;
        }
        .footer-action {
          margin: 0;
          font-size: 10px;
          font-weight: 400;
          line-height: 16px;
          font-style: normal;
          text-align: center;
          letter-spacing: 0em;
          text-decoration: none;
          font-family: Nunito Sans;
          color: ${footerText} !important;
        }
        .footer-action:hover {
          text-decoration: underline;
        }
        .footer-year {
          margin: 0;
          font-size: 10px;
          font-weight: 400;
          line-height: 16px;
          font-style: normal;
          text-align: center;
          letter-spacing: 0px;
          color: ${footerText};
          text-decoration: none;
          font-family: Nunito Sans;
        }
        .footer-logo {
          margin: 0;
          font-size: 16px;
          font-weight: 400;
          margin-top: 10px;
          line-height: 16px;
          font-style: normal;
          text-align: center;
          letter-spacing: 0px;
          color: ${footerText};
          text-decoration: none;
          font-family: Nunito Sans;
        }
      </style>
    </head>
    <body>
      <table role="presentation" class="outer-table">
        <tbody>
          <tr align="center">
            <td>
              <table role="presentation" class="table">
                <tbody class="table-body">
                  <tr class="header" align="center">
                    <td class="header-text">TEMPLATE</td>
                  </tr>
                  <tr>
                    <td class="body">
                      <table role="presentation" class="body-table">
                        <tr>
                          <td style="padding: 0">
                            <h4 class="body-user">Dear ${toTitleCase(
                              name
                            )},</h4>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0">
                            <p class="body-message">${message}</p>
                          </td>
                        </tr>
                        ${
                          button && url
                            ? `<tr align="center">
                                <td style="padding: 0">
                                  <div class="body-button-container">
                                    <a
                                      href="${url}"
                                      target="_blank"
                                      class="body-button"
                                      data-safedirecturl="${url}"
                                    >
                                      ${button}
                                    </a>
                                  </div>
                                </td>
                              </tr>`
                            : ""
                        }
                      </table>
                    </td>
                  </tr>
                  <tr align="center">
                    <td class="footer">
                      <table role="presentation" class="footer-table">
                        <tr align="center">
                          <td style="padding: 0">
                            <h5 class="footer-logo">
                              <a
                                target="_blank"
                                class="footer-website"
                                href="www.template.com"
                              >
                                template
                              </a>
                            </h5>
                          </td>
                        </tr>
                        <tr align="center">
                          <td style="padding: 0">
                            <p class="footer-description">
                              Business Description
                            </p>
                          </td>
                        </tr>
                        <tr align="center">
                          <td style="padding: 0">
                            <div>
                              <a
                                target="_blank"
                                class="footer-action"
                                href="https://www.template.com"
                              >
                                Unsubscribe
                              </a>
                              <span class="footer-action"> | </span>
                              <a
                                target="_blank"
                                class="footer-action"
                                href="https://www.template.com"
                              >
                                Change Preferences
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr align="center">
                          <td style="padding: 0">
                            <p class="footer-year">© 2021</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
`
}

module.exports = {
  emailTemplate,
}
