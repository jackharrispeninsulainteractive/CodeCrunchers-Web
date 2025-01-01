class Cookie {

    _key;
    _value;
    _expiry = null;

    constructor(key,value) {
        this._key = key;
        this._value = value;
    }

    setDuration(days){
        let date = new Date();
        date.setTime(date.getTime() + days*(24*60*60*1000));
        this._expiry = date.toUTCString();
    }

    save(){
        if(this._expiry === null){
            this.setDuration(365)
        }
        document.cookie = this._key + "=" + this._value +"; expires="+this._expiry+";path=/";
   }

    getValue(){
        return this._value;
    }

    static get(key){

        let cookieObject = null;

        document.cookie.split(";").forEach((cookie)=>{

            let keyValuePair = cookie.split("=");

            if(keyValuePair[0].trim() === key.trim()){
                cookieObject =  new Cookie(keyValuePair[0],keyValuePair[1]);
            }

        })

        return cookieObject;
    }

}