(function( grave, $, undefined ) {
    //Private Property
    var ws = "";

    grave.setSocket = function (websocket) {
        ws = websocket;
    }


    grave.getState = function(clientid, isInit = false) {
        let url = 'http://localhost:3000/matrix.json';
        

        fetch(url)
        .then(res => res.json())
        .then((out) => {
         console.log('Checkout this JSON! ', out);
            if(out && out.type === "gravedigger" && out.client != clientid)
            {
                state = out.state;
                grave.setup(clientid, isInit);
            }
           
        })
        .catch(err => { throw err });
    }

    grave.toggle =  function (e) {
        if(e.classList.contains("active"))
            {
                e.classList.remove("active");
            } else {
                e.classList.add("active");
            }
    }

    grave.lazy =  function (num) {
        console.log("num"+num);
        num = Number(num);
        switch(num) 
        {
            case 1:
                return "A";
            case 2:
                return "B";
            case 3: 
                return "C";
            case 4: 
                return "D";
            case 5:
                return "E";
            case 6: 
                return "F";
            case 7:
                return "G";
    
        }
        console.log("miss");
        return "";
    }

    grave.setup =  function(clientid, isInit) {
        
        if(state) {
         if(state.client == clientid || state.won ) {
            // document.querySelector("#cover").classList.add("overlay");
             ws.close();
             console.log("closed socket");
         } else if (document.querySelector("#cover").classList.contains("overlay")) {
             document.querySelector("#cover").classList.remove("overlay");
         }
 
         state.forEach(item => {
             if(item.class){
             document.querySelector(".active-board #"+ item.id).classList.add(item.class);
             } else if(document.querySelector(".active-board #"+ item.id).classList.contains("active")) {
                 document.querySelector(".active-board #"+ item.id).classList.remove("active");
             }
         });
        }
 
            if(isInit){
            document.querySelectorAll('.active-board .matrix').forEach(e=> e.addEventListener('click',(ev) => {
            // var toChange = [e];
            var selector = "";
            grave.toggle(e);
            if(e.dataset.row > 1) {
                console.log( e.dataset.row );
                selector = ".active-board #" + (grave.lazy(Number(e.dataset.row - 1))) + e.dataset.col;
                grave.toggle(document.querySelector(selector));
            }
            if(e.dataset.row  < 7) {
                selector = ".active-board #" + (grave.lazy(Number(e.dataset.row) + 1)) + e.dataset.col;
                grave.toggle(document.querySelector(selector));
            }
            if(e.dataset.col > 1) {
                selector = ".active-board #" + (grave.lazy(e.dataset.row)) + (Number(e.dataset.col)-1);
                grave.toggle(document.querySelector(selector));
            } 
            if(e.dataset.col < 7) {
                selector = ".active-board #" + (grave.lazy(e.dataset.row)) + (Number(e.dataset.col)+1);
                console.log(selector);
                grave.toggle(document.querySelector(selector));
            }
    
            grave.save(clientid);
    
            }));
        }
 
     };

     grave.save = function (clientid) {
        
        var obj = {
            "client": clientid,
            state: []
        };
      
        var board = document.querySelectorAll(".active-board .matrix");
        won = true; 
        for (var i=0;i<board.length;i++) {
            if(board[i].classList.contains("active"))
            {
                won = false;
            }
           
            obj.state.push({id: board[i].id,class: board[i].classList.contains("active") ? "active":""});

        }

        obj.won = won;
        if(won) {
          
            document.querySelector("#cover").classList.add("overlay");
        }

       // document.querySelector("#cover").classList.add("overlay");
        ws.send(JSON.stringify(obj));
    }

    grave.swap = function(selector, clientid) {
        var target = document.querySelector("#"+selector);
        var currenton = document.querySelector(".active-board");
        currenton.classList.remove("active-board");
        currenton.classList.add("off");

        target.classList.remove("off");
        target.classList.add("active-board");
        grave.setup(clientid,true);

    }

}( window.grave = window.grave || {} ));

// https://medium.com/swlh/synchronize-your-javsscript-app-with-async-mutex-f0149513ea4b
// https://spin.atomicobject.com/2018/09/10/javascript-concurrency/