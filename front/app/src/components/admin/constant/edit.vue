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
import VueFormGenerator from "vue-form-generator";
export default {
  props: ["oldmodel"],
  data() {
    return {
      model: JSON.parse(this.oldmodel),
      schema: {
        groups: [
          {
            legend: "تعديل  اعدادات عامة",
            fields: [
              {
                type: "input",
                inputType: "text",
                label: "مفتاح",
                model: "key",
                disabled: true,
                required: true,
                validator: validators.string.locale({
                  fieldIsRequired: "هذا الحقل مطلوب"
                })
              },
              {
                type: "input",
                inputType: "text",
                label: "القيمة",
                model: "value",
                required: true,
                validator: validators.string.locale({
                  fieldIsRequired: "هذا الحقل مطلوب"
                })
              },
              {
                type: "input",
                inputType: "text",
                label: "الاسم",
                model: "label",
                required: true,
                validator: validators.string.locale({
                  fieldIsRequired: "هذا الحقل مطلوب"
                })
              },
              {
                type: "submit",
                buttonText: "تعديل",
                validateBeforeSubmit: true,
                onSubmit: () => {
                  axios
                    .put("/admin/constant/" + this.model._id, {
                      newModel: this.model
                    })
                    .then(res => {
                      if (res.data.message == "updated") {
                        alert("تم التعديل بنجاح ");
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
