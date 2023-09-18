async function validateLogin(){

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if(!isValidEmail(username)){
        alert("Enter valid email");
        return;
    }

    try{
        const response = await fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userName: username, password: password})
        });

        const info = await response.json();

        if(info.stat === true){
           
            window.location.href = '/';
        }
        else{
            alert(info.msg);
        }

    }catch(err){
        alert("Error in api request");
        console.log(err);
    }

}

function isValidEmail(email) {
    // Regular expression for a valid email address
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    // Test the email against the regular expression
    return emailRegex.test(email);
  }