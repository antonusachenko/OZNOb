//alert("OZNOb was running");

    const receiveMessageBlock = document.getElementsByClassName("receivingDrawerWrapper_8hwfI");
    const receiveMessage = document.getElementsByClassName("logItemWrapper_hn0+X");
    const receiveForkClassName = ".portalTargetContainer_ptBjF";

    const autoreceiveXbutton = document.getElementsByClassName("closeIcon_I0cgh");
    const autoreceiveEndButton = document.getElementsByClassName("button_X+Guw");
    const autoreceiveButton = document.getElementsByClassName("button_X+Guw");

    // regex for find number
	const regexUsusal = /'\d*\d-\d\d*'/g;
    const regexCUR = /'CUR-\d*'/g;
    const regexMixed = /'\d{1,5}-\d{1,3}'|'CUR-\d*'/g;
    const regexResultFilter = /(?<=\').+?(?=\')/g;

    // fields
    var superWindow;
    var superWindowText;
    var innerHTML;
    var prevMatch;
    var CanRepeatSpeech = true;

    var autoreceiveXbutton_Listener;
    var autoreceiveEndButton_Listener;
    var autoreceiveButton_Listener;

    var isRecieveActive;


    // ------------ Start ------------

    console.log("Plugin ready to work");

    // Try to start Observer
    addObserverIfDesiredNodeAvailable();
    DrawSuperWindow();

    // ----------- Functions ------------

    function DrawSuperWindow(){
        //Draw new element SuperWindow
        superWindow = document.createElement("div");
        superWindow.id = "superNumber";
        document.body.appendChild(superWindow);
        superWindowText = document.createElement("p");
        superWindow.appendChild(superWindowText);
        superWindowText.style.cssText = 'font-size: 20vh;text-align: center;line-height: 400px;';
        superWindowText.innerHTML = "00-0";
        HideSuperWindows();
    }
    
    function Speak(text) {
        var text1 = text.match(/\d+(?=\-)/);
        var text2 = text.match(/[^-]*$/);
        var textResult;
        if( text1 == null | text1 == ""){
            textResult = text2;
        }
        else{
            textResult = text1 + " тире " + text2;
        }
        const message = new SpeechSynthesisUtterance();
        message.lang = "ru-RU";
        message.text = textResult;
        window.speechSynthesis.speak(message)
    }
    
    function ShowSuperWindow(){
        // old
        //superWindow.style.cssText = 'z-index:9999999999;position:fixed;display:table;align-items:center;top:calc(50% - 200px);left:100px;width:750px;height:400px;border-radius: 30px;-moz-border-radius:30px;background-color: #f2f2f2; Display: block;box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);';
        // new
        superWindow.style.cssText = 'z-index:9999999999;  position:fixed; display:table;  align-items:center;  top:calc(50% - 200px); left:100px;  width:750px; height:400px;  border-radius: 30px;  -moz-border-radius:30px;  Display: block;  background: rgb(215, 231, 245);  border: solid;  border-width: 30px; border-color: rgb( 232, 244, 255 );';
    }
    function HideSuperWindows(){
        superWindow.style.cssText = 'Display: none';
    }
    
    function ObserverDetect(){
        console.log("REFRESH WAS DETECT");
        
        //
        if (receiveMessageBlock.length == 0){
            isRecieveActive = false;
            HideSuperWindows();
            messageObserver.disconnect();
            console.log("MESSAGE OBSERVE STOPPED");
        }
        else{
            isRecieveActive = true;
            ShowSuperWindow();
            Subscribe();
            var element = receiveMessageBlock[0];
            messageObserver.observe(element, {childList: true});
            console.log("MESSAGE OBSERVE STARTED");
        }
    }

    function MessageObserverDetect(){
        console.log("MESSAGE WAS DETECT");

        //
        if (isRecieveActive){
            if(receiveMessage[0] != null){
                innerHTML = receiveMessage[0].children[1].innerHTML;
                console.log("innerHTML below: ");
                console.log(innerHTML);
                UpdateResult();
            }
        }
    }

    function UpdateResult() {
        var match = innerHTML.match(regexMixed)[0];
        //
        if (match == null || match == 'Undefined'){
            // Try recognition again
            window.setTimeout(ObserverDetect,100);
            console.log("match not found");
        }
        else{
            console.log("clear match info: " + match);
            //
            if(match != prevMatch){
                // Refresh superWindow
                console.log("Refresh superWindow and speech text");
                var result = match.match(regexResultFilter)[0];
                superWindowText.innerHTML = result;
                prevMatch = match;
                Speak(result);
                CanRepeatSpeech = false;
                window.setTimeout(ResetTimer, 5000);
            }
            else{
                console.log("match equal to prev match, do nothing");

            }

        }

    }

    // ------ Create Observers ---------

    var observer = new MutationObserver(ObserverDetect);
    //
    console.log("Observer created");
    // Add observer if desired element exist
    function addObserverIfDesiredNodeAvailable() {
        var elementNode = document.querySelectorAll(receiveForkClassName)[0]; //was detect block
        if(elementNode) {
            var config = {childList: true};
            // Start observing the target node for configured mutations
            observer.observe(elementNode, config);
            console.log("Observer started");
        }
        else{
            // The node we need does not exist yet.
            // Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable,500);
            console.log("Element not found, restart the function AddObserverIfDesuredNodeAvailable in 0.5 sec");
        }
    }

    var messageObserver = new MutationObserver(MessageObserverDetect);
    //
    console.log("MessageObserver created");
        //reference:
        //  messageObserver.observe(document.querySelectorAll(receiveMessageBlock)[0], {childList: true});
        //  messageObserver.disconnect();


    //
    function ResetTimer(){
        CanRepeatSpeech = true;
    }

    function Subscribe(){
        autoreceiveXbutton_Listener = autoreceiveXbutton[0].addEventListener("click", HideSuperWindows);
        autoreceiveEndButton_Listener = autoreceiveEndButton[8].addEventListener("click", HideSuperWindows);
    }

    function Unsubscribe(){
        autoreceiveXbutton_Listener = null;
        autoreceiveEndButton_Listener = null; // idk another method in this situation lmao
    }