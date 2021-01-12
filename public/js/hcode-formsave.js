HTMLFormElement.prototype.save = function (config) {

    // config : objeto com chaves sucess e failure
    console.log('HTMLFormElement save ---------------------------- ');        

    let form = this

    // ESTA PARADO AQUI !!!!
    console.log('HTMLFormElement save - form  ', form);        
    console.log('HTMLFormElement save - form.method  ', form.method);        

    form.addEventListener('submit', (e) => {

        e.preventDefault()


        let formData = new FormData(form)

        console.log('HTMLFormElement save - formData: ', formData);        

        console.log('Criou form action: ', form.action )
        console.log('Criou form method: ', form.method )
        console.log('Criou formData: ', formData )

        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => {
            console.log('Passou primeiro then' )

            response.json()
        })
        .then(json => { 

            console.log('JSON = ' , json)
            console.log('JSON = ' , json.error)

                if (json.error){

                if (typeof config.failure === 'function') {
                    config.failure(json.error)
                }
            } else {

                if (typeof config.success === 'function') {
                    config.success(json)
                }
            }

        })
        .catch(err => { 
        
            if (typeof config.failure === 'function') {
                config.failure(err)
            }
        })

    })


}