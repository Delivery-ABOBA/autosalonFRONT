var profile_image_input = document.getElementById("upload-profile-photo");
var tracks_placeholder = document.getElementById("tracks_placeholder");
var player_placeholder = document.getElementById("player_placeholder");

const server_host = "https://autosalon--delivery-aboba.repl.co";

const methods = ["POST", "PUT", "PATCH", "DELETE"]

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function print(text){
    console.log(text);
}

function not_found_handler(){
    window.location.href = "./404";
}

function forbidden_handler(){
    window.location.href = "./auth";
}

function logout(){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.location.href = "./auth";
}

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else{
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

if (getCookie("token") == null){
    forbidden_handler();
}

function CustomXHR(method, path, authorization=true){
    var xhr = new XMLHttpRequest();
    xhr.open(method, server_host + path);
    if (methods.includes(method)){ xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); }
    if (authorization == true){ xhr.setRequestHeader('authorization', 'Bearer ' + getCookie("token")); }
    return xhr;
}

function videos(){
    var xhr = CustomXHR("GET", "/sport/live");
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4 && xhr.status === 200){
        var items = JSON.parse(xhr.responseText);
        var parent=document.getElementById("trns");
        for(i=0;i<items.length;i++){
            parent.innerHTML+='<a href='+items[i].url+' class="card border-0 text-reset"><div class="card-body"><div class=" mb-3"><div><img src='+items[i].poster+'></div><br><h5 class="me-auto mb-0">'+items[i].name+'</h5></div></div></a>';
        }
      }        
    }
    xhr.send();
}

function NewsV(endpoint){
    var xhr = CustomXHR("GET", "/sport/news");
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            var items = JSON.parse(xhr.responseText);
            var parent=document.getElementById("NewsTab");
            parent.innerHTML='<div class="mb-8"><h2 class="fw-bold m-0">Новости</h2></div><div class="card-list" id = "NewsList"></div>';
            var parent=document.getElementById("NewsList");
            for(i=0; i<items.topStories.length; i++){
                parent.innerHTML+='<a href="https://www.livescore.com'+items.topStories[i].url+'" class="card border-0 text-reset"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h5 class="me-auto mb-0">'+items.topStories[i].title+'</h5></div></div></div></div></a>';
            }
        }        
    }
    xhr.send();
}

var DataMatches = null;

function SportV(endpoint, sport){
    var xhr = CustomXHR("GET", "/sport/?endpoint="+endpoint+"&sport="+sport);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            var items = JSON.parse(xhr.responseText);
            DataMatches = JSON.parse(xhr.responseText);
            var parent=document.getElementById("container");
            parent.innerHTML='<div class="mb-8"><h2 class="fw-bold m-0">Лиги</h2></div><div class="card-list" id = "liga"></div>';
            var parent=document.getElementById("liga");
            for(i=0; i<items.Stages.length; i++){
                parent.innerHTML+='<a href="#" class="card border-0 text-reset" onclick="Matches('+i+',`'+sport+'`)"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h5 class="me-auto mb-0">'+items.Stages[i].Snm+'</h5></div></div></div></div></a>';
            }
        }        
    }
    xhr.send();
}

function Matches(item, sport){
  var parent=document.getElementById("container");
  parent.innerHTML='<div class="mb-8"><h2 class="fw-bold m-0">'+DataMatches.Stages[item].Snm+'</h2></div><div class="card-list" id = "liga"></div>';
  var parent=document.getElementById("liga");
  for(i=0; i<DataMatches.Stages[item].Events.length; i++){
      var goals1 = DataMatches.Stages[item].Events[i].Tr1;
      var goals2 = DataMatches.Stages[item].Events[i].Tr2;
      var date = DataMatches.Stages[item].Events[i].Esd.toString();
      var temp="";
      for(d=0; d<date.length;d++){
        temp+=date[d];
        if(d==3||d==5){
          temp+="-";
        }
        if(d==7){
          temp+=" ";
        }
        if(d==9||d==11){
          temp+=":";
        }
      }
    if(goals1==undefined){goals1="-"}
    if(goals2==undefined){goals2="-"}
    if(sport=="soccer"){
      parent.innerHTML+='<a href="#" onclick="stats('+DataMatches.Stages[item].Events[i].Eid+',`'+sport+'`,`'+DataMatches.Stages[item].Events[i].T1[0].Nm+'`,`'+DataMatches.Stages[item].Events[i].T2[0].Nm+'`)" class="card border-0 text-reset"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h3 class="me-auto mb-0">'+DataMatches.Stages[item].Events[i].T1[0].Nm+'</h3><h3>'+goals1+'</h3></div><div class="d-flex align-items-center mb-3"><h3 class="me-auto mb-0">'+DataMatches.Stages[item].Events[i].T2[0].Nm+'</h3><h3>'+goals2+'</h3></div></div></div></div><div class="card-footer">'+temp+'</div></a>';
    }else
      parent.innerHTML+='<a href="#" onclick="table('+DataMatches.Stages[item].Events[i].Eid+',`'+sport+'`)" class="card border-0 text-reset"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h3 class="me-auto mb-0">'+DataMatches.Stages[item].Events[i].T1[0].Nm+'</h3><h3>'+goals1+'</h3></div><div class="d-flex align-items-center mb-3"><h3 class="me-auto mb-0">'+DataMatches.Stages[item].Events[i].T2[0].Nm+'</h3><h3>'+goals2+'</h3></div></div></div></div><div class="card-footer">'+temp+'</div></a>';
  }
}

function gen(parent, title, val1, val2){
  var val1=parseInt(val1);
  var val2=parseInt(val2);
  var max_val = val1 + val2;
  var min_val = 0;
  if(max_val!=0){
    parent.innerHTML+='<div style="display: flex;"><span style="display: inline-block; width:10%; margin: 2px;">'+val1+'</span><span style="display: inline-block; width:80%; margin: 2px;">'+title+'</span><span style="display: inline-block; width:10%; margin: 2px;">'+val2+'</span></div>';
    var val_percent = Math.round(100/max_val*val1);
    var val_percent2= 100-val_percent;
    parent.innerHTML+='<div style="display: flex; margin-bottom: 20px;"><div style="display: inline-block; width:50%; margin: 2px;"><div class="progress" style="transform: rotate(180deg);"><div aria-valuemax="'+max_val+'" aria-valuemin="'+min_val+'" aria-valuenow="'+val1+'" style="width: '+val_percent+'%" role="progressbar" class="progress-bar bg-info"></div></div></div><div class="progress" style="display: inline-block; width:50%; margin: 2px;"><div class="progress"><div class="progress-bar bg-warning" role="progressbar" style="width: '+val_percent2+'%" aria-valuenow="'+val2+'" aria-valuemin="'+min_val+'" aria-valuemax="'+max_val+'"></div></div></div></div>';
  }
}

function stats(eid, sport, team1, team2){
    var xhr = CustomXHR("GET", "/sport/stats?eid="+eid+"&sport="+sport);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            var items = JSON.parse(xhr.responseText);
            print(items);
            var parent=document.getElementById("container");
            parent.innerHTML='<div class="mb-8"><h2 class="fw-bold m-0">Статистика</h2></div><div class="card-list" id = "liga" style="text-align: center;"></div>';
            var parent=document.getElementById("liga");
            parent.innerHTML+='<div style="display: flex;"><h2 style="display: inline-block; width:50%; margin-bottom: 20px; text-align: left;">'+team1+'</h2><h2 style="display: inline-block; width:50%; margin-bottom: 20px; text-align: right;">'+team2+'</h2></div>';
          if(items==null){
            parent.innerHTML="Данных по матчу еще нет";
            return;
          }
          items=items.Stat;
          if(items==null){
            parent.innerHTML="Данных по матчу еще нет";
            return;
          }
            for(i=0; i<Object.keys(items[0]).length; i++){
              if(i==0){
                gen(parent,"Удары по воротам",items[0].Shon, items[1].Shon);
              }
              if(i==1){
                gen(parent,"Удары мимо ворот",items[0].Shof, items[1].Shof);
              }
              if(i==2){
                gen(parent,"Заблокированные удары",items[0].Shbl, items[1].Shbl);
              }
              if(i==3){
                gen(parent,"Ведений",items[0].Pss, items[1].Pss);
              }
              if(i==4){
                gen(parent,"Перехваты",items[0].Cos, items[1].Cos);
              }
              if(i==5){
                gen(parent,"Офсайды",items[0].Ofs, items[1].Ofs);
              }
              if(i==6){
                gen(parent,"Фоллы",items[0].Fls, items[1].Fls);
              }
              if(i==7){
                gen(parent,"Броски",items[0].Ths, items[1].Ths);
              }
              if(i==8){
                gen(parent,"Желтые карточки",items[0].Ycs, items[1].Ycs);
              }
              if(i==9){
                gen(parent,"Подач с флангов",items[0].Crs, items[1].Crs);
              }
              if(i==10){
                gen(parent,"Контр-атаки",items[0].Att, items[1].Att);
              }
              if(i==11){
                gen(parent,"Отраженные мячи",items[0].Gks, items[1].Gks);
              }
              if(i==12){
                gen(parent,"Травмы",items[0].Trt, items[1].Trt);
              }
            }
        }        
    }
    xhr.send();
}

function table(eid, sport){
    var xhr = CustomXHR("GET", "/sport/table?eid="+eid+"&sport="+sport);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            var items = JSON.parse(xhr.responseText);
            print(items);
            var parent=document.getElementById("container");
            parent.innerHTML='<div class="mb-8"><h2 class="fw-bold m-0">Статистика</h2></div><div class="card-list" id = "liga" style="text-align: center;"></div>';
            var parent=document.getElementById("liga");
            if(items==null){
              parent.innerHTML="Данных по матчу еще нет";
              return;
            }
            if(sport=="basketball"){
                var g11=items.Tr1Q1;
                var g12=items.Tr1Q2;
                var g13=items.Tr1Q3;
                var g14=items.Tr1Q4;
                var g21=items.Tr2Q1;
                var g22=items.Tr2Q2;
                var g23=items.Tr2Q3;
                var g24=items.Tr2Q4;
                if(g11==undefined){var g11=" "}
                if(g12==undefined){var g12=" "}
                if(g13==undefined){var g13=" "}
                if(g14==undefined){var g14=" "}
                if(g21==undefined){var g21=" "}
                if(g22==undefined){var g22=" "}
                if(g23==undefined){var g23=" "}
                if(g24==undefined){var g24=" "}
               parent.innerHTML+='<table class="table table-bordered"><thead><tr><th scope="col">Команды</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">4</th><th scope="col">T</th></tr></thead><tbody><tr><th scope="row">'+items.T1[0].Nm+'</th><td>'+g11+'</td><td>'+g12+'</td><td>'+g13+'</td><td>'+g14+'</td><td>'+items.Tr1OR+'</td></tr><tr><th scope="row">'+items.T2[0].Nm+'</th><td>'+g21+'</td><td>'+g22+'</td><td>'+g23+'</td><td>'+g24+'</td><td>'+items.Tr2OR+'</td></tr></tbody></table>';
            }
            if(sport=="hockey"){
                var g11=items.Tr1Pe1;
                var g12=items.Tr1Pe2;
                var g13=items.Tr1Pe3;
                var g1OT=items.Tr1OT;
                var g21=items.Tr2Pe1;
                var g22=items.Tr2Pe2;
                var g23=items.Tr2Pe3;
                var g2OT=items.Tr2OT;
                if(g11==undefined){var g11=" "}
                if(g12==undefined){var g12=" "}
                if(g13==undefined){var g13=" "}
                if(g1OT==undefined){var g1OT=" "}
                if(g21==undefined){var g21=" "}
                if(g22==undefined){var g22=" "}
                if(g23==undefined){var g23=" "}
                if(g2OT==undefined){var g2OT=" "}
                parent.innerHTML+='<table class="table table-bordered"><thead><tr><th scope="col">Команды</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">OT</th><th scope="col">T</th></tr></thead><tbody><tr><th scope="row">'+items.T1[0].Nm+'</th><td>'+g11+'</td><td>'+g12+'</td><td>'+g13+'</td><td>'+g1OT+'</td><td>'+items.Tr1+'</td></tr><tr><th scope="row">'+items.T2[0].Nm+'</th><td>'+g21+'</td><td>'+g22+'</td><td>'+g23+'</td><td>'+g2OT+'</td><td>'+items.Tr2+'</td></tr></tbody></table>';
            }
            if(sport=="tennis"){
                var s11=items.Tr1S1;
                var s12=items.Tr1S2;
                var s13=items.Tr1S3;
                var s14=items.Tr1S4;
                var s15=items.Tr1S5;
                var s21=items.Tr2S1;
                var s22=items.Tr2S2;
                var s23=items.Tr2S3;
                var s24=items.Tr2S4;
                var s25=items.Tr1S5;
                if(s11==undefined){var s11=" "}
                if(s12==undefined){var s12=" "}
                if(s13==undefined){var s13=" "}
                if(s14==undefined){var s14=" "}
                if(s15==undefined){var s15=" "}
                if(s21==undefined){var s21=" "}
                if(s22==undefined){var s22=" "}
                if(s23==undefined){var s23=" "}
                if(s24==undefined){var s24=" "}
                if(s25==undefined){var s25=" "}
                parent.innerHTML+='<table class="table table-bordered"><thead><tr><th scope="col">Команды</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">4</th><th scope="col">5</th><th scope="col">SETS</th></tr></thead><tbody><tr><th scope="row">'+items.T1[0].Nm+'</th><td>'+s11+'</td><td>'+s12+'</td><td>'+s13+'</td><td>'+s14+'</td><td>'+s15+'</td><td>'+items.Tr1+'</td></tr><tr><th scope="row">'+items.T2[0].Nm+'</th><td>'+s21+'</td><td>'+s22+'</td><td>'+s23+'</td><td>'+s24+'</td><td>'+s25+'</td><td>'+items.Tr2+'</td></tr></tbody></table>';
            }
        }
    }
  xhr.send();
}

function Ads(){
  var parent=document.getElementById("container");
  parent.innerHTML='<div class="tab-content" role="tablist"><div class="tab-pane fade active show" id="create-chat-info" role="tabpanel"><div class="card border-0"><div class="profile"><br><div class="profile-body p-0"><div class="avatar avatar-lg"><span class="avatar-text bg-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></span><div class="badge badge-lg badge-circle bg-primary border-outline position-absolute bottom-0 end-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div><input id="upload-chat-img" class="d-none" type="file"><label class="stretched-label mb-0" for="upload-chat-img"></label></div></div></div><div class="card-body"><form autocomplete="off"><div class="row gy-6"><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите марку</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите модель</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите год выпуска</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите цену</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите цвет</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите объем двигателя</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите л.с.</label></div></div><button class="btn btn-lg btn-primary w-100 d-flex align-items-center" type="button">Добавить<span class="icon ms-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></span></button></div></form></div></div></div></div>';
}

function TO(){
  var parent=document.getElementById("NewsTab");
  parent.innerHTML='<div class="d-flex align-items-center"><h2 class="me-auto mb-0">Запись на ТО</h2></div><div class="tab-content" role="tablist"><div class="tab-pane fade active show" id="create-chat-info" role="tabpanel"><div class="card border-0"><div class="profile"><br></div><div class="card-body"><form autocomplete="off"><div class="row gy-6"><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите марку</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите модель</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите год выпуска</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Последнее пройденое ТО</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">ФИО</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Номер телефона</label></div></div><button class="btn btn-lg btn-primary w-100 d-flex align-items-center" type="button">Записаться<span class="icon ms-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></span></button></div></form></div></div></div></div>';
}

function Repair(){
  var parent=document.getElementById("NewsTab");
  parent.innerHTML='<div class="d-flex align-items-center"><h2 class="me-auto mb-0">Запись на ремонт</h2></div><div class="tab-content" role="tablist"><div class="tab-pane fade active show" id="create-chat-info" role="tabpanel"><div class="card border-0"><div class="profile"><br></div><div class="card-body"><form autocomplete="off"><div class="row gy-6"><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите марку</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите модель</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите год выпуска</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">ФИО</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Номер телефона</label></div></div><div class="form-floating"><textarea class="form-control" placeholder="Description" id="floatingTextarea" rows="8" data-autosize="true" style="min-height: 100px; overflow: hidden; overflow-wrap: break-word; resize: none; height: 100px;"></textarea><label for="floatingTextarea">Опишите проблему</label></div><button class="btn btn-lg btn-primary w-100 d-flex align-items-center" type="button">Записаться<span class="icon ms-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></span></button></div></form></div></div></div></div>';
}

function Insurance(){
  var parent=document.getElementById("NewsTab");
  parent.innerHTML='<div class="d-flex align-items-center"><h2 class="me-auto mb-0">Страховка</h2></div><div class="tab-content" role="tablist"><div class="tab-pane fade active show" id="create-chat-info" role="tabpanel"><div class="card border-0"><div class="profile"><br></div><div class="card-body"><form autocomplete="off"><div class="row gy-6"><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите марку</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите модель</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите год выпуска</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Гос номер</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">ФИО</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Номер телефона</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">email</label></div></div><button class="btn btn-lg btn-primary w-100 d-flex align-items-center" type="button">Оформить<span class="icon ms-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></span></button></div></form></div></div></div></div>';
}

function TestDrive(){
  var parent=document.getElementById("NewsTab");
  parent.innerHTML='<div class="d-flex align-items-center"><h2 class="me-auto mb-0">Тест-Драйв</h2></div><div class="tab-content" role="tablist"><div class="tab-pane fade active show" id="create-chat-info" role="tabpanel"><div class="card border-0"><div class="profile"><br></div><div class="card-body"><form autocomplete="off"><div class="row gy-6"><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите марку</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Введите модель</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">ФИО</label></div></div><div class="col-12"><div class="form-floating"><input type="text" class="form-control" id="floatingInput" placeholder="Enter a chat name"><label for="floatingInput">Номер телефона</label></div></div><button class="btn btn-lg btn-primary w-100 d-flex align-items-center" type="button">Записаться<span class="icon ms-auto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></span></button></div></form></div></div></div></div>';
}

function Services(){
  var parent=document.getElementById("NewsTab");
  parent.innerHTML='<div class="mb-8"><h2 class="fw-bold m-0">Услуги</h2></div><div class="card-list"><a href="#" class="card border-0 text-reset" onclick="TO()"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h5 class="me-auto mb-0">ТО</h5></div></div></div></div></a><a href="#" class="card border-0 text-reset" onclick="Repair()"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h5 class="me-auto mb-0">Ремонт</h5></div></div></div></div></a><a href="#" class="card border-0 text-reset" onclick="Insurance()"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h5 class="me-auto mb-0">Страховка</h5></div></div></div></div></a><a href="#" class="card border-0 text-reset" onclick="TestDrive()"><div class="card-body"><div class="row gx-5"><div class="col"><div class="d-flex align-items-center mb-3"><h5 class="me-auto mb-0">Тест-Драйв</h5></div></div></div></div></a></div>';
}
