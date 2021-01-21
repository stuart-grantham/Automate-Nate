# Automate-Nate
A program that automates the tech challenge, while solving issues with popups and accurately creating a representation of the webpage stored in the '/output/' folder.  

It makes good use of Selenium's wait method that allows for very deterministic web automation

##Requirements

Selenium webdriver: 'npm install selenium-webdriver'
Chrome webdriver binary is included. [docs link](https://www.selenium.dev/documentation/en/selenium_installation/installing_webdriver_binaries/)
to run 'node automation_script.js' while in the path

##Techstck
I'm using a node.js script utilising Selenium for the webpage automation. Node, because it simplifies scripting in the webpage as the only language is javascript and Selenium because its widely used and reliable.

##Unit Test
to be run after 'automation_script' to check its performance. To run 'node test_script' while in the path
The script will loop through the html outputs which contain records of all clicks, and inputs. It will specifically test the inputs into the for by re-opening the stored .html webpages in selenium, and matching up what was meant to be input and what actually got inputted.

 