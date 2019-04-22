function attachEvents(id_password) {
    var Input=document.getElementById(id_password);
    Input.addEventListener('onekeyup',ChangePWDStrength,false);
    alert(id_password);
    function getLvl(txt) {
        //默认级别是0
        var lvl = 0;
        //判断这个字符串中有没有数字
        if (/[0-9]/.test(txt)) {
            lvl++;
        }
        //判断字符串中有没有字母
        if (/[a-zA-Z]/.test(txt)) {
            lvl++;
        }
        //判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(txt)) {
            lvl++;
        }
        return lvl;
    }
     function ChangePWDStrength() {
        alert(this.value);
        document.querySelector('#strengthLevel').className = "strengthLv" + (this.value.length < 6 ? 0 : getLvl(this.value));
    }
};