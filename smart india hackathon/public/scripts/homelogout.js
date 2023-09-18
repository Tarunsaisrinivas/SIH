async function logout(){

    console.log("invoked")

    try{

        const response = await fetch('/logout',{
            method : 'POST'
        });
    
        const info = await response.json();
    
        if(info.stat === true){
            window.location.href = '/login';
        }
        else{
            alert("unable to logout");
        }

    }catch(err){
        alert("unable to send logout request");
    }

}