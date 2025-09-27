export default {
    install(app) {
        app.config.globalProperties.$formatRupiah = function (value) {
            if (!value) return 'Rp 0';
                return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        };
        app.config.globalProperties.$noticeAxios = function (proxy , response) {         
            proxy.$swal.fire({
                title: "Ops , Something wrong!",
                text: response.data.message,
                icon: "warning"
            });  
        },
        app.config.globalProperties.$messageError = function (proxy , title, message) {         
            proxy.$swal.fire({
                icon: "error",
                title:title,
                text: message,
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            });  
        },
        app.config.globalProperties.$messageSuccess = function (proxy , title, message) {         
            proxy.$swal.fire({
                icon: "success",
                title:title,
                text: message,
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            });  
        },
        app.config.globalProperties.$messageConfirm = function (proxy) {         
            return proxy.$swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });  
        },
        app.config.globalProperties.$searchParam = function ( args  ) {                
            let params = '';      
            args.forEach( post => {
                if( post.value !== 'undefined') {
                    params += post.field+':'+post.oprs+':'+post.value +'|' 
                }
                    
            })
            return params           
        }
        app.config.globalProperties.$downloadParam = function ( args ) {   

            return args           
        }

        app.config.globalProperties.$export = function ( data  , filename ) {   
            const url = window.URL.createObjectURL(  new Blob([ data ],{  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  }));
            const link = document.createElement("a");
            link.href = url;
           
            link.setAttribute("download",  filename ); 
            document.body.appendChild(link); 
            link.click(); 
        }

        app.config.globalProperties.$printArea = function ( areas , title  ) {    
            const printableContent = document.getElementById(areas)
            const printWindow = window.open('', '', 'height=1000,width=1000')
            printWindow.document.write(`
                <html>
                <head>
                    <title>${title}</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    
                </head>
                <body>
                    ${printableContent.innerHTML}
                </body>
                </html>
            `); 
            setTimeout(() => {
                const autoClose = true 
                printWindow.focus();
                printWindow.print();
                console.warn('autoClose', autoClose);
                if (autoClose) {
                    setTimeout(function () {printWindow.close();}, 1);
                }
                
            }, 1000);
                
            return true; 
        }
    }
  };