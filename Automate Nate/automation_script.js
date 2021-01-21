const {Builder, By, Key, until, WebElementCondition, Condition} = require('selenium-webdriver');
const fs = require('fs');

async function close_popup(driver){
    //closes the open popup (if there is one)
    let popup = await driver.findElement(By.css("div[id=popup] > section > h2 > input[type=button]"))
    try {
        driver.wait(until.elementIsVisible(popup), 4000)
    }
    catch(e){
        //sucess, no popup was visilble
        return;
    }
    //otherwise, click close
    await popup.click()
    //no popup now!
}

async function mark_visible(driver){
    //marks all visibile elements.... fairly inefficiently so unused
    let all_elements = await driver.findElements(By.css("*"));
    let visible_elements = all_elements.map(el => el.isDisplayed())
    //neat bit of functional programming
    var visible_elements_list = await Promise.all(visible_elements)
    for (el in all_elements){

         if (visible_elements_list[el]){
            await driver.executeScript("arguments[0].setAttribute('nate-visible','true')",all_elements[el])
            }
            else {
            await driver.executeScript("arguments[0].setAttribute('nate-visible','false')",all_elements[el])
            }
        
    }



}

async function nate_action(driver, element_to_be_actioned, action_to_take, wait_condition = null, dict_key = null) {

    //performs a click, or input according to the standards wanted (adding attribute to the DOM, saves page, ect), 
    // driver is just the webdriver object 
    // element_to_be_actioned is the locator for the element

    var page_title
    var page_source
    var file_name
    let el = await driver.findElement(element_to_be_actioned);
    try {

        await driver.wait(until.elementIsVisible(el),wait_time)
    }
    catch(e){
        //could be a popup, close it and retry
        await close_popup(driver)
        await driver.wait(until.elementIsVisible(el),wait_time)
    }
    switch (action_to_take){

        case "click":
        case "check":
            //add the attribute on the object to be clicked
            await driver.executeScript("arguments[0].setAttribute('action-type','"+action_to_take+"')",el)
            //mark the visible nodes
            //get a representation of the page and save it
            page_title = await driver.getTitle()
            page_source = await driver.getPageSource()
            var file_name = output_folder+"Action "+action_number+" Before "+ action_to_take + " Input " + dict_key + " Title " + page_title + ".html"
            fs.writeFile(file_name,page_source, function (err) {if (err) {throw err} })

            try{
                await el.click()
            }
            catch(e){
                //maybe a popup?
                await close_popup(driver)
                //retry after getting rid of popup, if it wasn't error!
                await driver.wait(until.elementIsVisible(el),wait_time)
                await el.click()
            }
            break;

        case "input":
            //add the attribute on the object to be input
            await driver.executeScript("arguments[0].setAttribute('action-type','input')",el)
            page_title = await driver.getTitle()
            page_source = await driver.getPageSource()
            file_name = output_folder+"Action "+action_number+" Before "+ action_to_take + " Input " + dict_key + " Title " + page_title + ".html"
            fs.writeFile(file_name,page_source, function (err) {if (err) {throw err} })
            try{
                await el.click()
                await el.sendKeys(automation_inputs[dict_key])
            }
            catch(e){
                await close_popup(driver)
                await driver.wait(until.elementIsVisible(el),wait_time)
                await el.click()
                await el.sendKeys(automation_inputs[dict_key])
            }
            break;


    }
    action_number = action_number + 1
    //is there a wait planned

    if (wait_condition instanceof WebElementCondition || wait_condition instanceof Condition || typeof(wait_condition) == 'function'){
        //if so, perform it
        try{
            await driver.wait(wait_condition,wait_time)}
        catch(e){
            //could be a popup, close it and retry
            await close_popup(driver)
            await driver.wait(wait_condition,wait_time)
        }
    }
    //is this an action using a dictionary value?
    if (typeof(dict_key) == 'string') {
        //add the key value to the element
        var script_to_send = "arguments[0].setAttribute('nate-dict-key','"+dict_key+"')"
        await driver.executeScript(script_to_send,el)
        //add the webpage post action value as a attribute, important step as a webpage side description of what was put in
        if (action_to_take == 'input'){
            script_to_send = "arguments[0].setAttribute('nate-value-input',arguments[0].value)"
            await driver.executeScript(script_to_send,el)  
        }
        //add the current post action value as a attribute




    }

 
    //gets the post action output

    page_title = await driver.getTitle()
    page_source = await driver.getPageSource()
    file_name = output_folder+"Action "+action_number+" After "+action_to_take +" Input " + dict_key + " Title " + page_title + ".html"
    fs.writeFile(file_name,page_source, function (err) {if (err) {throw err} })
}


async function main_run() {
    //performs the full actions as described
        let driver = await new Builder().forBrowser('chrome').build()
        try{
            //open the site
            await driver.get(nate_test_site)
            //click on the start button
            await nate_action(driver, By.css("input[type=button]"),"click",until.titleContains("Page 2"))
            //click on the city selector
            await nate_action(driver,By.css("span[class=custom-select-trigger]"),'click',until.elementIsVisible(await driver.findElement(By.css("div > span[data-value="+automation_inputs.city+" i]"))))
            //click on city dictionary value, and add that into the page html
            await nate_action(driver, By.css("div > span[data-value="+automation_inputs.city+" i]"),'click',until.elementLocated(By.css("div[class=custom-select]")),"city")
            //click Next
            await nate_action(driver, By.css("input[id=next-page-btn]"),'click',until.titleContains("Page 3"))
            
            
            //input form data
            //each one of these uses the same id selector, as the jquery script that error checks the form in the site itself uses the id as well.
            // sending some jquery to the webpage that fills this out for me 
            //is an option, but isn't automation-ey enough 
            await nate_action(driver, By.id("name"),'input',false,"name")
            await nate_action(driver, By.id("pwd"),'input',false,"password")
            await nate_action(driver, By.id("phone"),'input',false,"phone")
            await nate_action(driver, By.id("email"),'input',false,"email")
    
    
    
            //put in gender, 
            await nate_action(driver, By.id("defaultCheck2"),'check',async function() {
                //function that checks if the female checkbox is checked, outputs truthy value
                return await driver.executeScript("return arguments[0].checked",await driver.findElement(By.id("defaultCheck2")))
                },
            "gender")
    
    
            //press submit
            await nate_action(driver, By.id("btn"),"click",until.titleContains("Page 4"))
    
        }
        catch{
            console.log("error in process")
            
        }
        finally{
            driver.close();
        }
    }
    

//read the 'dictionary' inputs from the JSON file 
const output_folder = process.cwd() + "\\output\\"
//fs.mkdirSync(output_folder)
let input_file = fs.readFileSync('automation_inputs.json')
let automation_inputs = JSON.parse(input_file)
//add a phone number
automation_inputs.phone = "0123456789"
let nate_test_site = "https://nate-eu-west-1-prediction-test-webpages.s3-eu-west-1.amazonaws.com/tech-challenge/page1.html";
//set the wait time 
var wait_time = 20000;
//
action_number = 0





main_run()





  
