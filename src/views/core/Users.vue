<template>
    <div class="wrapper">
     <div class="header-nav ">
       <h3> <i class="bi bi-layout-sidebar"></i> Users Administration </h3>
  
     </div>
     <div class="page">
      <BCard no-body class="">
        <BTabs card>
          <BTab title="Summary Charts" >

            <div class="row">
              <div class="col-md-4">
                <div class="card bg-arsir" style="min-height: 250px;">

                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-arsir" style="min-height: 250px;">

                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-arsir" style="min-height: 250px;">

                </div>
              </div>

              <div class="col-md-12 mt-4">
                <div class="card bg-arsir" style="min-height: 150px;">

                </div>
              </div>
            </div>
            
          </BTab>
          <BTab title="Users Lists" active >
            <div class="toolbar">
              <div class="row mb-3">
                <div class="col-md-4">
                  <button pill  class="btn btn-sm btn-success btn-rounded" @click="modal = true"><i class=" bi bi-person-plus" /> New User</button>
                </div>
              </div>
               

            </div>

            <BTable  hover striped :fields="fields" :items="items" />

            
          </BTab> 
          <BTab title="Group Management">
            <BTable bordered hover :items="itemsGroup" :fields="fields_group" />
          </BTab>
        </BTabs>
      </BCard> 

     
      <BModal v-model="modal" title="Form User"> Form goes here ? </BModal>
     </div>
   </div>
     
   </template>
   <script>
     export default {
      data() {
        return {
          loading:true ,
          modal:false ,
          items: [],      
          itemsGroup: [],       
          fields: [
            {
              label: 'Avatar',
              key: 'lasts_name',
              sortable: true,
            },
            {
              label: 'Username',
              key: 'username',
              sortable: true,
            },
            {
              label: 'First Name',
              key: 'first_name',
              sortable: true,
            },
            {
              label: 'Last Name',
              key: 'last_name',
              sortable: true,
            },
            {
              label: 'Email Address',
              key: 'email', 
            },  
            {
              label: 'Status',
              key: 'active' 
            },
            {
              label: 'Group',
              key: 'groups', 
            }
          ],
          fields_group: [
             
            {
              label: 'Group Name',
              key: 'name',
              sortable: true,
            },
            {
              label: 'Total Users',
              key: 'total', 
            },  
            {
              label: 'Level',
              key: 'level' 
            }
          ]
        }
      },
      mounted: function () 
      {       
          this.fetchData()	
          this.fetchDataGroup()	

      },
      methods: {
        fetchData() {

          this.loading = true 
          this.$store.dispatch('getData',{
              url     :  'api/sximo/apps/users'  
          }) .then(response => {
              this.items = response.data.data.data
              this.loading = false  

              })
              .catch((error) => {
                this.$swal( error)  
              })  

        },
        fetchDataGroup() {

          this.loading = true 
          this.$store.dispatch('getData',{
              url     :  'api/sximo/apps/groups'  
          }) .then(response => {
              this.itemsGroup = response.data.data.data
              this.loading = false 
              

              })
              .catch((error) => {
                this.$swal( error)  
              })  

        },
      }
    
    }
  </script>
   