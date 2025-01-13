export function sendTestEmail() {
  const subject = "Verification";
  const html = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            .gradient-border {
              border: 6.25px solid;
              border-color: #8e54e9;
              border-image-slice: 1;
              border-radius: 29.44px;
              padding: 20px;
              background: white;
              width: 626px;
              height: 800px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body style="font-family: Arial, Helvetica, sans-serif; text-align: center; align-items: center;">
          <div class="gradient-border">
            <div
              style="width: 138px; height: 34px; margin-top: 39px; margin-left: 190px;"
            >
              <img
                src="http://img.mailinblue.com/6329647/images/66695bd38c821_1718180819.png"
              />
            </div>
            <div style="margin-top: 35px; align-items: center; display: flex; margin-bottom: 15px;">
              <div
                  style="background-color: #ffffff; width: 200px; height: 200px"
              ></div>
              <div>
                <img
                src="http://img.mailinblue.com/6329647/images/66695c991b3ba_1718181017.png"
              />
              
              </div>
            </div>

            <div style="top: 178px">
              <h2 style="font-size: 22px; text-align:center">Verification Code (OTP)</h2>
              <p style="font-size: 16px; text-align:center">
                  We've received a request to verify your account. Please use the </br> following verification code to proceed. </br>If you did not make this request, kindly ignore this email.
              </p>
            </div>

            <div
              style="
                top: 382px; 
                letter-spacing: 0.5em;
                padding: 10px;
                margin-top: 20px;
                margin-bottom: 40px; 
                font-size: 24.99px;
                font-weight: bold;
                color: #411092;
                text-align:center;
              "
            >
             otp
            </div>

            <div style="margin-left: 60px; margin-right: 60px; text-align:center;">
              <hr style="color: #bdbdbd; align-items: center;" />
              <p style="text-align:center;">
                  If you have any questions while getting started, please visit <a href="https://www.dazhboard.com/">www.dazhboard.com</a>  for support.
              </p>
            </div>

            <div style="margin-top: 70px; font-size: 13.96px; text-align: center;">
              <p>Download Dazhboard Mobile App</p>
            
              <div style="text-align: center;">
                <a href="https://apps.apple.com/us/app/dazhboard/id123456789" target="_blank">
                  <img
                    src="http://img.mailinblue.com/6329647/images/66695c9be3b7d_1718181019.png"
                    alt="Download on App Store"
                  />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.dazhboard" target="_blank" style="margin-left: 10px;">
                  <img
                    src="http://img.mailinblue.com/6329647/images/66695c9feff17_1718181023.png"
                    alt="Download on Play Store"
                  />
                </a>
              </div>
            </div>
            
            

            <div>
              <div
                class="footer"
                style="
                  font-size: 12px;
                  color: #224975;
                  display: flex;
                
                  text-align: center;
                  margin-top: 10px;
                  margin-right: 40px;
                  margin-left: 50px;
                "
              >
                <div
                  style="background-color: #ffffff; width: 10px; height: 20px"
                ></div>

                <p style="font-size: 13px;">•Terms & Conditions</p>
                <div
                  style="background-color: #ffffff; width: 50px; height: 20px"
                ></div>
                <p style="font-size: 13px;">©️ 2023 Neztdo Corporation</p>
                <div
                  style="background-color: #ffffff; width: 50px; height: 20px"
                ></div>
                <p style="font-size: 13px;">• Privacy Policy</p>
                <div
                  style="background-color: #ffffff; width: 10px; height: 20px"
                ></div>
              </div>
            </div>
          </div>
        </body>
      </html>
  `;

  return { subject, html };
}

