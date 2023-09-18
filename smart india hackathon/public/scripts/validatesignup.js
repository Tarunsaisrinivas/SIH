

async function validateSignup(){

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if(username == "" || password == "" || confirmPassword == ""){
        alert('Please fill in all fields');
        return;
    }

    if(!isValidEmail(username)){
        alert("Enter valid email");
        return;
    }

    if(password != confirmPassword){
        alert("password and confirm password are not same");
        return;
    }

    try{

        const response = await fetch('/signup',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userName: username, password: password})
        });

        const info = await response.json();

        if(info.stat == true){
            window.location.href="/login";
        }
        else{
            alert(info.msg);
        }

    }catch (err) {

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