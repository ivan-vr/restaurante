class HcodeGrid {

    constructor(configs) {

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
            onUpdateLoad: (formUpdate, name, data) => {

                let input = formUpdate.querySelector(`[name=${name}]`)
                if (input) {
                    input.value = data[name]
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

        // array com todas as tr's da tabela
        this.rows = [...document.querySelectorAll('table tbody tr')]

        this.formCreate = document.querySelector(this.options.formCreate)
        this.formUpdate = document.querySelector(this.options.formUpdate)

        this.init ()
    }


    init () {

        this.initForms ()

        this.initButtons ()

    }


    initForms (){

        this.formCreate.save({
            success: () => {

                this.fireEvent('afterFormCreate')
            },
            failure: () => {

                this.fireEvent('afterFormCreateError')
            }
            
        })

        this.formUpdate.save({
            success: () => {

                this.fireEvent('afterFormUpdate')
            },
            failure: () => {

                this.fireEvent('afterFormUpdateError')
                
            }
        })
      
    }

    fireEvent(name, args) {
        
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

        //this.options.listeners.beforeUpdateClick(e)
        this.fireEvent('beforeUpdateClick', [e])

        let data = this.getTrData (e) 

        //   Para cada propriedade da <tr>
        for (let name in data) {

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

        this.rows.forEach(row => {

            let arrayBtn = [...row.querySelectorAll('.btn')]
            arrayBtn.forEach(btn => {

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