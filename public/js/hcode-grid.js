class HcodeGrid {

    constructor(configs) {

        // Define default e sobrescreve se chamador definiu o listener
        configs.listeners = Object.assign({
            afterUpdateClick: (e) =>  {
                $('#modal-update').modal('show')
            },
            afterDeleteClick: (e) =>  {
                window.location.reload()
            },
            afterFormCreate: (e) =>  {
                window.location.reload()
            },
            afterFormUpdate: (e) =>  {
                window.location.reload()
            },
            afterFormCreateError: (e) =>  {
                alert('Não foi possível enviar o formulário.')
            },
            afterFormUpdateError: (e) =>  {
                alert('Não foi possível enviar o formulário.')
            },
            onUpdateLoad: (form, name, data) => {
                let input = form.querySelector(`[name=${name}]`)
                if (input) {
                    input.value = data[name]
                }
            }
        }, configs.listeners)

        let configPadrao = {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete'
        }

        this.options = Object.assign({}, configPadrao, configs)

        // console.log('OPTIONS: ', this.options)

        this.formCreate = document.querySelector(this.options.formCreate)
        this.formUpdate = document.querySelector(this.options.formUpdate)

        this.init ()
    }


    init () {


        this.initForms ()

        this.initButtons ()


    }


    initForms (){
      
        this.formCreate.save()
        .then(json => { 
      
          this.fireEvent('afterFormCreate')
      
        })
        .catch(err => { 
          
            this.fireEvent('afterFormCreateError')
        })
      

        this.formUpdate.save()
        .then(json => { 
      
          this.fireEvent('afterFormUpdate')
      
        })
        .catch(err => { 
          
            this.fireEvent('afterFormUpdateError')
        })
      
    }

    fireEvent(name, args) {

        if (typeof(this.options.listeners[name]) === 'function') {
            this.options.listeners[name].apply(this,args)
        }

    }

    getTrData (e) {

        // No evento 'e' existe a chave 'path' que tem 'tr'
        // Busca a 'tr' em 'path' e retorna para a variavel tr
        let tr = e.path.find (el => {
            return el.tagName.toUpperCase() === 'TR'
        })

        // Como row é string, precisa usar o parse para criar um objeto 

        return JSON.parse(tr.dataset.row)
    }

    initButtons () {

        // UPDATE 

        let arrayBtn = [...document.querySelectorAll(this.options.btnUpdate)]
        arrayBtn.forEach(btn => {

            btn.addEventListener('click', e => {

                //this.options.listeners.beforeUpdateClick(e)
                this.fireEvent('beforeUpdateClick', [e])

                let data = this.getTrData (e) 

                for (let name in data) {

                    this.fireEvent('onUpdateLoad', [this.formUpdate, name, data]) 

                }

                this.fireEvent('afterUpdateClick', [e])


            })

        })

        // DELETE 

        // btn btn-xs btn-danger btn-delete

        arrayBtn = [...document.querySelectorAll(this.options.btnDelete)]
        arrayBtn.forEach(btn => {

            // Listener para botão de DELETE

            btn.addEventListener('click', e => {

                this.fireEvent('beforeDeleteClick', [e])

                let data = this.getTrData (e)  

                // data é usado dentro do eval

                if (confirm(eval('`' + this.options.deleteMsg + '`'))) {

                    //  fetch faz o request para o servidor 
                    //  É uma comando do ajax
                    //  let promise = fetch(url, [options])

                    fetch(eval('`' + this.options.deleteUrl + '`'), {
                        method: 'DELETE'
                    })
                    // retorna como texto, entao tem que transformar para json
                    .then (response => response.json()) 
                    .then (json => {

                        this.fireEvent('afterDeleteClick', [e])
                    })

                }      
            })

        });

    }

}