<template>
  <b-container fluid style="text-align:right;">
    <link rel="stylesheet" href="/ms.css" />
    <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
  </b-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
import pikaday from "pikaday";
import { validators } from "vue-form-generator";
export default {
  data() {
    return {
      model: {
key : '',
value : '',
label : ''
},
      schema: {
        groups: [
          {
            legend: "أضافة اعدادات عامة",
            fields: [
             
{
type: 'input',
inputType: 'text',
label:'مفتاح',
model:'key',
required:true,
validator:validators.string.locale({fieldIsRequired: 'هذا الحقل مطلوب'}),
},
{
type: 'input',
inputType: 'text',
label:'القيمة',
model:'value',
required:true,
validator:validators.string.locale({fieldIsRequired: 'هذا الحقل مطلوب'}),
},
{
type: 'input',
inputType: 'text',
label:'الاسم',
model:'label',
required:true,
validator:validators.string.locale({fieldIsRequired: 'هذا الحقل مطلوب'}),
}
,

              {
                type: "submit",
                buttonText: "انشاء",
                validateBeforeSubmit: true,
                onSubmit: () => {
                  axios
                    .post("/admin/constant/", {
                      newModel: this.model
                    })
                    .then(res => {
                      if (res.data.message == "created") {
                        alert("تم الانشاء بنجاح يمكنك انشاء منتج آخر");
                      }
                    });
                }
              }
            ]
          }
        ]
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
        validateAsync: true
      }
    };
  },

  methods: {}
};
</script>

<style>
.multiselect__option {
  text-align: center !important;
}
.form-group.error .errors span {
  float: right;
}
.removeImage {
  position: relative;
  display: block;
  margin: -96px auto;
  background-color: #f44336;
  border: 0;
  padding: 10px;
  color: #fff;
}
.multiselect__tags {
  text-align: center;
}
</style>
