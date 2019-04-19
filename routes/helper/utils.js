module.exports = function validate(type, val){
    switch (type) {
        case 'isEmail':
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(val.toLowerCase())
    
        case 'isNumber':
            var re = /^\d+$/
            return re.test(val)

        case 'isString':
            var re =  /^[a-zA-Z]*$/
            return re.test(val) 
            
        case 'isBankCode':
            var re = /^\d+$/
            return re.test(val) && (val.length === 3)

        case 'isPhone':
            val = val.replace(/[^\w\s]/gi, '')
            return (val.length > 9)
    }
}

