document.getElementById("test-command").oninput = document.getElementById("test-string").oninput = document.getElementById("command-method").onchange = document.getElementById("submit").onclick = function () {
    runRegex();
}

function runRegex() {
    var input_box = document.getElementById("test-string");
    var output_box = document.getElementById("output-string");
    var command_box = document.getElementById("test-command");
    output_box.style.color = "black";
    var string = input_box.value;
    var output = "";
    if (string != "") {
        var inputcommand = command_box.value;
        if (inputcommand != "") {
            var command = "/" + inputcommand + "/" + document.getElementById("command-method").value;
            try {
                var result = string.match(eval(command));
                if (result != null) {
                    var num = result.length;
                    if (result.length == 1 && result[0] == "") {
                        num = 0;
                    }
                    output = "查找到 " + num + " 个结果：\n";
                    for (var line of result) {
                        output += line + "\n";
                    }
                    output_box.value = output;
                }
                else {
                    output = "该表达式没有查询到结果呢！请换一个表达式吧~~~";
                    output_box.style.color = "blue";
                    output_box.value = output;
                }
            } catch (error) {
                output = "你输入的正则表达式好像出现错误了呢！！检查一下吧~~\n错误描述：" + error.message + "\n";
                output_box.style.color = "red";
                output_box.value = output;
            }
        }
        else {
            output = "亲，你好像还没有输入表达式哦~~";
            command_box.placeholder = output;
            output_box.value = "";
        }
    }
    else {
        output = "亲，是不是忘了什么事呢？还没有输入测试文本呢(~.~)";
        input_box.placeholder = output;
        output_box.value = "";
    }
}