function emailTemplate({ name, message, url, buttonText }) {
  let nameVol = name
  if (nameVol) {
    nameVol = nameVol.split("")
    nameVol[0] = nameVol[0].toUpperCase()
    nameVol = nameVol.join("")
  }
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
          color: #303335;
          font-family: "Nunito Sans", sans-serif;
        }
        .outer-table {
          border: 0;
          margin: 0;
          padding: 0;
          width: 100%;
          border-spacing: 0;
          background: #ffffff;
          border-collapse: collapse;
        }
        .table {
          border: 0;
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: 500px;
          border-spacing: 0;
          background: #ffffff;
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
          background-color: #f0f0f0;
        }
        .header-text {
          margin: 0;
          font-size: 2em;
          color: #303335;
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
        }
        .body-message {
          margin: 0;
          padding: 0;
          margin: 20px 0;
        }
        .body-button-container {
          margin-top: 40px;
        }
        .body-button {
          color: #303335;
          text-align: center;
          border-radius: 5px;
          text-decoration: none;
          background-color:   #f0f0f0;
          padding: 12px 20px 12px 20px;
        }
        .body-button:hover {
          color: #303335;
        }
        .footer {
          width: 100%;
          padding: 20px 0;
          background-color: #f0f0f0;
        }
        .footer-table {
          border: 0;
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
        }
        .footer-website {
          margin: 0;
          display: block;
          color:  #303335;
          font-size: 15px;
          font-weight: 700;
          line-height: 20px;
          font-style: normal;
          text-align: center;
          margin-bottom: 6px;
          letter-spacing: 0em;
          text-decoration: none;
          font-family: Nunito Sans;
        }
        .footer-website:hover {
          color: #303335;
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
          text-decoration: none;
          font-family: Nunito Sans;
        }
        .footer-action {
          margin: 0;
          color:  #303335;
          font-size: 10px;
          font-weight: 400;
          line-height: 16px;
          font-style: normal;
          text-align: center;
          letter-spacing: 0em;
          font-family: Nunito Sans;
        }
        .footer-action:hover {
          color: #303335;
        }
        .footer-year {
          margin: 0;
          font-size: 10px;
          font-weight: 400;
          line-height: 16px;
          font-style: normal;
          text-align: center;
          letter-spacing: 0px;
          font-family: Nunito Sans;
        }
        .footer-logo {
          margin: 0;
          font-size: 16px;
          color:  #303335;
          font-weight: 400;
          margin-top: 10px;
          line-height: 16px;
          font-style: normal;
          text-align: center;
          letter-spacing: 0px;
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
                            <h4 class="body-user">Dear ${nameVol},</h4>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0">
                            <p class="body-message">${message}</p>
                          </td>
                        </tr>
                        ${
                          buttonText &&
                          `
                        <tr align="center">
                          <td style="padding: 0">
                            <p class="body-button-container">
                              <a
                                href="${url}"
                                target="_blank"
                                class="body-button"
                                data-safedirecturl="${url}"
                              >
                                <font color="#FFFFFF">${buttonText}</font>
                              </a>
                            </p>
                          </td>
                        </tr>
                        `
                        }
                      </table>
                    </td>
                  </tr>
                  <tr align="center">
                    <td class="footer">
                      <table role="presentation" class="footer-table">
                        <tr align="center">
                          <td style="padding: 0">
                            <a
                              target="_blank"
                              class="footer-website"
                              href="www.skupreme.com"
                              ><font color="#393948">template.com</font>
                            </a>
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
                                <font color="#393948"> Unsubscribe</font></a
                              >
                              <span class="footer-action"> | </span>
                              <a
                                target="_blank"
                                class="footer-action"
                                href="https://www.template.com"
                              >
                                <font color="#393948">Change Preferences</font>
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr align="center">
                          <td style="padding: 0">
                            <p class="footer-year">© 2021</p>
                          </td>
                        </tr>
                        <tr align="center">
                          <td style="padding: 0">
                            <h5 class="footer-logo">template</h5>
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
