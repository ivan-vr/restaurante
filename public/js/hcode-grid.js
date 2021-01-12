class HcodeGrid {

    constructor(configs) {

console.log('Entrou construtor HcodeGrid ')

        // Object  --> Define default e sobrescreve se chamador definiu o listener
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

                console.log('>>> onUpdateLoad  -  form : ', form);        

                let input = form.querySelector(`[name=${name}]`)
                if (input) {
                    input.value = data[name]
                    console.log('>>> onUpdateLoad  -  name : ', name);        
                    console.log('>>> onUpdateLoad  -  value : ', input.value);        
                }
            }
        }, configs.listeners)

        let configPadrao = {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete'
        }

        this.options = Object.assign({}, configPadrao, configs)


 console.log('OPTIONS: ', this.options)

        // array com todas as tr's da tabela
        this.rows = [...document.querySelectorAll('table tbody tr')]

 console.log('ROWS: ', this.rows)

         this.init ()
    }


    init () {

        console.log('Inicio init --------------');

        this.initForms ()

        this.initButtons ()

        console.log('Fim init --------------');

    }


    initForms (){
      

        console.log('Init forms ')

        this.formCreate = document.querySelector(this.options.formCreate)

        
        console.log('Init forms formCreate: ', this.formCreate)

        this.formCreate.save({
            success: () => {
                console.log('Init forms success')

                this.fireEvent('afterFormCreate')
            },
            failure: () => {
                console.log('Init forms failure')

                this.fireEvent('afterFormCreateError')
            }
            
        })

        this.formUpdate = document.querySelector(this.options.formUpdate)

        console.log('Init forms formUpdate: ', this.formUpdate)

        this.formUpdate.save({
            success: () => {
                console.log('Init forms success')

                this.fireEvent('afterFormUpdate')
            },
            failure: () => {
                console.log('Init forms failure')
                this.fireEvent('afterFormUpdateError')
                
            }
        })
      
    }

    fireEvent(name, args) {
        
        // name: 'buttonClick'
        // args: [e.target, this.getTrData(e), e ]

        console.log('fireEvent  name:  ', name)
        console.log('fireEvent  function: ', this.options.listeners[name])

        if (typeof(this.options.listeners[name]) === 'function') {

            this.options.listeners[name].apply(this, args)

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

    btnUpdateClick (e) {

        console.log('>>>   btnUpdateClick -----------------');        

        //this.options.listeners.beforeUpdateClick(e)
        this.fireEvent('beforeUpdateClick', [e])

        let data = this.getTrData (e) 

console.log('>>> data: ', data);        
        for (let name in data) {

            console.log('>>> name: ', name);        

            this.fireEvent('onUpdateLoad', [this.formUpdate, name, data]) 

        }

        this.fireEvent('afterUpdateClick', [e])
        
    }


    btnDeleteClick (e) {
        
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

    }

    initButtons () {

        console.log('Init Buttons ')


        this.rows.forEach(row => {

            let arrayBtn = [...row.querySelectorAll('.btn')]
            arrayBtn.forEach(btn => {

     //           console.log('Init Buttons - add click  ', btn)

                btn.addEventListener('click', e => {

                    // classList nao usa o '.' para se referir a classe
                    // entao foi tirado de btnUpdate e btnDelete
                    if (e.target.classList.contains(this.options.btnUpdate)) {
                        this.btnUpdateClick(e)
                    } else if (e.target.classList.contains(this.options.btnDelete)) {
                        this.btnDeleteClick(e)
                    } else {

                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e ])
                    }

                })

            })

        })

    }

}