const conn = require('./db')

class Pagination {

    constructor (sql, params = [], itemsPerPage = 10) {

        this.sql = sql
        this.params = params
        this.itemsPerPage = parseInt(itemsPerPage)

    }

    getPage(page) {

        this.currentPage = parseInt(page)

        let initialRecNumber = (this.currentPage - 1) * this.itemsPerPage

        this.params.push(
            initialRecNumber,
            this.itemsPerPage
        )

        return new Promise ((resolve, reject) => {

            let sqlFoundRows = ' select found_rows() as found_rows '

            let sqls = this.sql + '; ' + sqlFoundRows

            //let sqls = [this.sql, sqlFoundRows].join(';')

            conn.query(sqls, this.params, (err, results) => {

                if (err) {

                    reject(err)

                } else {

                    this.data = results[0]
                    this.totalLines = parseInt(results[1][0].found_rows)
                    this.totalPages = Math.ceil(this.totalLines / this.itemsPerPage)

                    resolve(this.data)

                }
            }) 
        }) 
    }

    getTotalLines () {
        return this.totalLines
    }

    getTotalPages () {
        return this.totalPages
    }

    getCurrentPage () {
        return this.currentPage
    }

    getNavigation(params) {  

        let links = []

        let limitePagesNav = 5

        let nrstart = 0
        let nrend = 0

        let limitePagesNavConta = limitePagesNav
        if (limitePagesNav % 2 === 0) {
            limitePagesNavConta = limitePagesNav + 1
        }

//        let result = this.getCurrentPage() + parseInt(limitePagesNavConta/2)

        if (this.getTotalPages() < limitePagesNav) {
            limitePagesNav = this.getTotalPages()
        } 
        
        if ((this.getCurrentPage() - parseInt(limitePagesNavConta/2)) < 2) {

            nrstart = 1
            nrend = limitePagesNav

        } else if ((this.getCurrentPage() + parseInt(limitePagesNavConta/2)) >= this.getTotalPages()) {

            nrstart = this.getTotalPages() - limitePagesNavConta + 1
            nrend = this.getTotalPages()

        } else {

            nrstart = this.getCurrentPage() - parseInt(limitePagesNavConta/2) 
            nrend = this.getCurrentPage() + parseInt(limitePagesNavConta/2)
        }

        if (this.getCurrentPage() > 1) {

            links.push({
                text: '«',
                href: `?` + this.getQueryString(  Object.assign({}, params, {
                    page: this.getCurrentPage()-1
                })  )
            })

        }

        for (let i = nrstart; i <= nrend; i++) {

            links.push({
                text: i,
                href: `?` + this.getQueryString(  Object.assign({}, params, {page: i})  ),
                active: (i === this.getCurrentPage())
            })
        }
        
        
        if (this.getCurrentPage() < this.getTotalPages()) {

            links.push({
                text: '»',
                href: `?` + this.getQueryString(  Object.assign({}, params, {
                    page: this.getCurrentPage()+1
                })  )
            })

        }


        return links
    }


    getQueryString(params) {

        let queryString = []

        for (let name in params) {
            queryString.push(`${name}=${params[name]}`)
        }
         
        return queryString.join('&')
    }

}

module.exports = Pagination



