document.querySelector('.button-flat').addEventListener('click', () => {
    const key = document.querySelector('#key').value;
    const website = document.querySelector('#website').value;

    (async () => {
        const rawResponse = await fetch('/newAPI', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({key: key, website: website})
        });
        const content = await rawResponse.json();
        document.getElementById("display").style.display = "block";

        if(content.success == true){
            var url = "localhost:3001/" + key + "/" + website
            document.getElementById("display").value = url
            const input = document.getElementById('display');
            input.style.width = (url.length + 1) * 8 + 'px'; // Anpassen der Breite basierend auf der Anzahl der eingegebenen Zeichen
          
        }else{
            document.getElementById("display").value = "ERROR"
        }
        
        

      })();
  });
  