if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/service_worker.js').then((reg)=>console.log('Serviço registrado com sucesso',reg)).catch((err)=>console.log("Erro inesperado",err));

}