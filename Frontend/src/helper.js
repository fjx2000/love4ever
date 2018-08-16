let ajaxError = {
  code: 1,
  error: undefined
}

export const ajaxGet = (url, callback) => {
fetch(url, {
    method: 'GET',
  }).then((response) => response.json())
  .then((responseJson) => {
    callback(responseJson);
  })
  .catch((error) => {
    console.log(error);
    ajaxError.error = error;
    callback(ajaxError);
  });
}

export const ajaxPost = (url, jsonBody, callback) => {
fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonBody)
  })
  .then((response) => response.json())
  .then((responseJson) => {
    callback(responseJson);
  })
  .catch((error) => {
    console.log(error);
    ajaxError.error = error;
    callback(ajaxError);
  });
}

export const isMobile = () => {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

export const isAndroid = () =>{
   if( navigator.userAgent.match(/Android/i)){
     return true;
   }
   else{
     return false;
   }
}

export const isiPhone = () =>{
  if( navigator.userAgent.match(/iPhone/i)){
    return true;
  }
  else{
    return false;
  }
}

export const colorLinks = (linkColor) =>{
    let links = document.getElementsByTagName("a");
    for(let i=0; i<links.length; i++)
    {
        if(links[i].href)
        {
            links[i].style.color = linkColor;
        }
    }
}

export const isLandscape = () =>{
  if (window.orientation == 90 || window.orientation == -90){
    return true;
  }else{
    return false;
  }
}

export const getArgumentFromAddressBar = (name) =>{
  let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if(r!=null){
    return  unescape(r[2]);
  }else{
     return null;
  }
}
