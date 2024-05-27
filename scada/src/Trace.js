import axios from 'axios'
import store from '@/store/index'


export function logTraceguardar(tabla, descripcion){
    
    axios.post('api/LogTraces/Crear',{
        'idUsuario': parseInt(store.state.usuario.idUsuario),
        'Table': tabla,
        'Description': descripcion
    }).then(function(response){
        //console.log("logtraceguardar : " + store.state.usuario.idUsuario + " " + tabla + " : " + descripcion);
    }).catch(function(error){
        console.log(error);
    })
}

export function errTraceguardar(procedure, descripcion, number, source, obj){
    
    let errorsString="";
    if(!!obj)
    {
        for (let key of Object.keys(obj)) {
            errorsString = errorsString + [key].toString() + ": "+ obj[key].toString() + " "
            }
    }

    axios.post('api/ErrTraces/Crear',{
        'ProcedurName': procedure,
        'ErrDescription': descripcion + " " + errorsString,
        'ErrNumber': number,
        'ErrSource': "VUE JS: " + source,
    }).then(function(response){
        //console.log("logtraceguardar : " + store.state.usuario.idUsuario + " " + tabla + " : " + descripcion);
    }).catch(function(error){
        console.log(error);
    })
}

export function errTraceguardarAxios(procedure, obj){
    
    let errorsString=obj.message;
    if(!!obj.response.data.title)
    {
        errorsString = errorsString+ ". "+ obj.response.data.title;
    }
    else if(!!obj.response.data)
    {
        errorsString = errorsString+ ". "+ obj.response.data;
    }
    else{
        errorsString = errorsString+ "."
    }

    if(!!obj.response.data.errors)
    {
            for (let key of Object.keys(obj.response.data.errors)) {
                errorsString = errorsString + [key].toString() + ": "+ obj.response.data.errors[key].toString() + " "
                }
    }
    
    axios.post('api/ErrTraces/Crear',{
        'ProcedurName': procedure,
        'ErrDescription': errorsString.substring(0,1000),
        'ErrNumber': obj.response.status.toString(),
        'ErrSource': "VUE JS: " + obj.name,
    }).then(function(response){
        //console.log("logtraceguardar : " + store.state.usuario.idUsuario + " " + tabla + " : " + descripcion);
    }).catch(function(error){
        console.log(error);
    })
}