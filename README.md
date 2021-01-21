# Automate-Nate
A program that automates the tech challenge, while solving issues with popups and accurately creating a representation of the webpage stored in the `/output/` folder.  

It uses a execution function `nate action()` that takes a web-element finder, the action to be done, and the condition that the action has been completed correctly. It then makes good use of Selenium's wait method before and after the element has been actioned that allows for very deterministic web automation. All the while capturing the current source, with attributes added (`action-type`, `nate-dict-key`, and `nate-value-input`) to indicate what's been actioned.

## Requirements

Selenium webdriver: `npm install selenium-webdriver`
Chrome webdriver binary for windows is included. [docs link](https://www.selenium.dev/documentation/en/selenium_installation/installing_webdriver_binaries/)
if using mac, unzip `webdrivermac1` and replace `webdriver.exe` with the contents. Also `const output_folder = process.cwd() + "\\output\\"` must be replaced with `const output_folder = process.cwd() + "/output/" on the scripts. 
To run `node automation_script.js` while in the path

## Techstack
I'm using a node.js script utilising Selenium for the webpage automation. Node, because it simplifies scripting in the webpage as the only language is javascript and Selenium because its widely used and reliable.

## Unit Test
to be run after `automation_script` to check its performance. To run `node test_script` while in the path
The script will loop through the html outputs which contain records of all clicks, and inputs. It will specifically test the inputs done by the `automation_script` by re-opening the stored .html webpages in selenium, and matching up what was meant to be input and what actually got inputted.

 
