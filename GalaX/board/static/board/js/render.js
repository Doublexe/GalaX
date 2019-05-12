/** Render the local buffer
 * 
 * Priority + Random TODO:
 */
// Some problems: https://stackoverflow.com/questions/29934583/why-doesnt-the-length-of-the-array-change-when-i-add-a-new-property
function render(galaxy, buffer, option) {
 galaxy.extend(buffer[option].events);
}


/** Check if login. If so, do the func. Else alert. */
function on_login(func, para) {
 $.ajax({
  url: "/board/is_login",
  method: 'GET',
  dataType: 'json', // Assign json will automatically parse json response.
  success: function (msg) {
   if (msg.login == 1) {
    if (para) { func(para); }
    else {
     func();
    }

   } else {
    alert("请先登录");
   }
  },
 });
}

export { render, on_login }