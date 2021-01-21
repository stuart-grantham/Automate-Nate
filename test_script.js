const {Builder, By, Key, until, WebElementCondition, Condition} = require('selenium-webdriver');
const fs = require('fs');

async function test_1() {
    // a simple test that opens the outputted .html source and checks the inputs have been actually confirmed inputted to the webpage
    //could be completed with the city choice, gender too.. 

    try{
        //open selenium
        let driver = await new Builder().forBrowser('chrome').build()
        //set test output
        var test_output = {sucess:true,comment:'' }
        let file_select_regrex = /Action [0-9]* After input.*/
        let get_input_out_regrex = /Action [0-9]* After \w* Input (\w*) .*/
        //get list of files where there were inputs
        let files_to_scan = fs.readdirSync(output_folder).filter(file => file_select_regrex.test(file))
        if (files_to_scan < 4){
            //somethings gone wrong, not enough input actions have happened
            test_output.sucess = false
            test_output.comment= 'test failed, automation did input enough into page'
            return test_output
        }
        for (scan_file of files_to_scan){
            //extract the input-ed dict key
            var dict_key_actioned = get_input_out_regrex.exec(scan_file)[1]
            //open up saved representation of scanned file
            await driver.get(output_folder+scan_file)
            //check element is there
            let el = await driver.findElement(By.css("[nate-dict-key="+dict_key_actioned+"]"))
            var value_inputted = await el.getAttribute('nate-value-input')
            //check the value inputted was the one stored in the dictionary
            if (automation_inputs[dict_key_actioned] == value_inputted){
                test_output.comment += "for dictionary key:" + dict_key_actioned + " the correct value was input:" + value_inputted + "\r\n"
            }else{
                test_output.comment += "for dictionary key:" + dict_key_actioned + "the correct value was not input, instead it was:" + value_inputted + "\r\n"
                test_output.sucess=false
            }
  
        }
        driver.close()
        return test_output
        


    }
    catch(e){
    //errored during execution..
        await driver.close();
        test_output.sucess = false
        test_output.comment = "error in the test itself"
        return test_output;
    }


}

//read the 'dictionary' inputs from the JSON file 
const output_folder = process.cwd() + "\\output\\"
let input_file = fs.readFileSync('automation_inputs.json')
let automation_inputs = JSON.parse(input_file)
automation_inputs.phone = "0123456789"
//add a phone number
//set the wait time 
var wait_time = 20000;


test_1().then(log => console.log("test status sucess:" + log.sucess + "\r\ncomment:\r\n" + log.comment))
