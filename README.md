<div align="center">
 <h1><br/>CJ-Brower : A fingerprint browser
</h1>
 <a href="https://www.buymeacoffee.com/maryjoins" target="_blank"><img alt="" src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black" style="vertical-align:center" /></a>
 <img src="https://img.shields.io/npm/v/npm?style=normal"/>
 <img src="https://img.shields.io/website?style=normal&url=https%3A%2F%2Fgprm.itsvg.in/"/> 
 <img src="https://img.shields.io/badge/License-GPL%20v3-brightgreen?style=normal"/>
 <img src="https://img.shields.io/github/languages/code-size/VishwaGauravIn/github-profile-readme-maker?logo=github&style=normal"/>
</div>
<br/>

![image](https://github.com/SnJForever/CJ-Browser-front/assets/31909226/6ed63ac1-dfe7-462c-b79a-97199f6b6467)

# Features
Browser fingerprinting is the technique of creating a distinct identifier by gathering and documenting an array of factors encompassing the browser, operating system, and hardware settings. This unique digital signature is derived from a meticulous analysis of various browser attributes, including the user agent, language, screen dimensions, plugin versions, fonts, time settings, and more. Since each individual's browser setup is unique, browser fingerprints have the potential to be employed for monitoring online behavior, recognizing user identities, and even, regrettably, for illicit activities such as fraudulent schemes and phishing attempts.

### ⚡ Lightning Fast Profile Creation
Just four steps to open a fingerprint browser.
- download the source code
- download the main program main.exe to ```./resources/browermain```
- run ```npm isntall``` 
- run ```npm run dev```

### 📊 Fingerprint option

- Operating System: Modify the operating system part in `userAgent`.
- Browser version: Modify the browser version in `userAgent`.
- Proxy settings: Modify the browser proxy which supports "Default", "Do not use proxy", "Custom".
- User Agent: Modify `userAgent`.
- Language: Modify `navigator.language`, `navigator.languages`, and it can be automatically matched based on IP.
- Time zone: Modify the time zone in `new Date()`, and it can be automatically matched based on IP.
- WebRTC
- Geolocation: Modify the latitude and longitude in `navigator.geolocation.getCurrentPosition()`, and it can be automatically matched based on IP.
- Resolution: Modify `screen.width`/`screen.height`.
- Font: Randomly modify the supported font list.
- Canvas: Randomly modify Canvas 2D drawing differential pixels.
- WebGL image: Randomly modify WebGL drawing differential pixels.
- WebGL metadata: WebGL vendor, WebGL rendering, etc.
- AudioContext: Randomly modify the differential data of `getChannelData` and `getFloatFrequencyData` in AudioContext.
- ClientRects
- Device name
- Do Not Track
- SSL
- Port scan protection
- Hardware acceleration

### 👥 Acknowledgments
<a href="https://github.com/lauthieb/code-notes" target="_blank"><img alt="" src="https://github.com/SnJForever/CJ-Browser-front/assets/31909226/c25cc2aa-55f0-48e1-a0ed-ecf42f2cd1a4" style="vertical-align:center" /></a>
</a>

### Statement

This GitHub repository is provided for informational and educational purposes. The content and code within this repository are offered "as is" and without any warranty, express or implied.

The repository's owner and contributors are not responsible for any damages, issues, or consequences resulting from the use of the code, information, or any other material contained within this repository. Users are encouraged to exercise caution, conduct their own assessments, and adhere to relevant guidelines and best practices when using or modifying any code or information from this repository.

The use of any code or information from this repository is at the user's own risk. The repository owner and contributors are not liable for any loss, damage, or inconvenience, including but not limited to data loss, financial loss, or system malfunctions, that may occur as a result of using this repository.

Please be aware that this repository may contain third-party content or dependencies, and their usage is subject to their respective licenses and disclaimers. Users should review and comply with these licenses when using such content.

By using the materials within this repository, you acknowledge and accept the terms and conditions outlined in this disclaimer. If you do not agree with these terms, do not use or interact with the content in this repository.