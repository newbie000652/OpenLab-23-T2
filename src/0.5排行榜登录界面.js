function getValue(id) { 
    return document.getElementById(id).value; 
} 
function checkuser() { 
    if(getValue('uname') == "114514" && getValue('pwd') == "114514") { 
        return true; 
    }else { 
        alert("登录名或密码错误！")
        return false; 
    } 
} 
function guestLogin() {
    window.location.href = "0.5排行榜.html";
}