<template>
  <div class="blogpostform">
    <div>
      <h1>New blogpost</h1>
    </div>
    <v-layout class="blogpostfields pa-5" row wrap>
      <v-flex xs12>
        <v-text-field
          v-model="blogpost.title"
          label="Solo"
          placeholder="Título"
          solo
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field
          v-model="blogpost.description"
          label="Solo"
          placeholder="Descrição"
          solo
        ></v-text-field>
      </v-flex>

      <v-flex xs12 sm6 md4>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="blogpost.date"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="blogpost.date"
              label="Escolher data"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            next-icon=">"
            prev-icon="<"
            v-model="blogpost.date"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>

            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(blogpost.date)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs12>
        <h3>Upload Image</h3>
        <div>
          <input
            @change="onFileChange"
            class="file"
            type="file"
            name="thumbnail"
          />
        </div>
      </v-flex>

      <h6>Editor:</h6>
      <v-flex xs12>
        <div v-model="rawText" id="pell" class="pell" />
      </v-flex>
      <h6>HTML Output:</h6>
      <v-flex xs12 sm6>
        <pre v-model="blogpost.body" id="pell-html-output" class="output"></pre>
      </v-flex>
      <br />
      <br />
      <v-flex xs12 sm6>
        <v-btn large style="font-weight: bold" @click="submitBlogpost()"
          >Submit</v-btn
        >
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import pell from "pell";

export default {
  data: () => ({
    menu: false,
    modal: false,
    menu2: false,
    blogpost: {
      title: "",
      description: "",
      date: new Date().toISOString().substr(0, 10),
      thumbnail: "",
      body: "",
    },
    rawText: "",
    editorOptions: [
      "bold",
      "underline",
      {
        name: "italic",
        result: () => window.pell.exec("italic"),
      },

      {
        name: "image",
        result: () => {
          const url = window.prompt("Enter the image URL");
          if (url) window.pell.exec("insertImage", ensureHTTP(url));
        },
      },
      {
        name: "link",
        result: () => {
          const url = window.prompt("Enter the link URL");
          if (url) window.pell.exec("createLink", ensureHTTP(url));
        },
      },
    ],
    editorClasses: {
      actionbar: "pell-actionbar",
      button: "pell-button",
      content: "pell-content",
      selected: "pell-button-selected",
    },
  }),
  methods: {
    doSomething() {
      console.log("Hello");
    },
    doSomethingAfterMounted() {
      console.log("Editor mounted");
    },
    ensureHTTP: (str) => (/^https?:\/\//.test(str) && str) || `http://${str}`,

    submitBlogpost() {
      console.log(this.blogpost);
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files; //guarda a imagem selecionada
      if (!files.length) return; //se não for selecionada uma imagem quando for submetido o formulário,
      //este campo aparecerá vazio, na consola do browser
      this.createThumbnail(files[0]); //obtem o primeiro campo do método createThumbnail
    },
    createThumbnail(file) {
      var reader = new FileReader(); //lê o ficheiro selecionado
      var vm = this;
      reader.onload = (e) => {
        vm.blogpost.thumbnail = e.target.result;
      };
      reader.readAsDataURL(file); //o ficheiro selecionado é convertido em "URL Data"
    },
  },
  mounted() {
    pell.init({
      element: document.getElementById("pell"),
      onChange: (html) => {
        window.document.getElementById("pell-html-output").textContent = html;
        this.blogpost.body = html;
      },
      actions: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "heading1",
        "heading2",
        {
          name: "heading3",
          icon: "H3",
          title: "Heading 3",
          result: () => pell.exec("formatBlock", "<H3>"),
        },
        {
          name: "heading4",
          icon: "H4",
          title: "Heading 4",
          result: () => pell.exec("formatBlock", "<H4>"),
        },
        {
          name: "heading5",
          icon: "H5",
          title: "Heading 5",
          result: () => pell.exec("formatBlock", "<H5>"),
        },
        {
          name: "heading6",
          icon: "H6",
          title: "Heading 6",
          result: () => pell.exec("formatBlock", "<H6>"),
        },
        "paragraph",
        "quote",
        "olist",
        "ulist",
        "code",
        "line",

        {
          name: "image",
          result: () => {
            const url = window.prompt("Enter the image URL");
            if (url) pell.exec("insertImage", this.ensureHTTP(url));
          },
        },
        {
          name: "link",
          result: () => {
            const url = window.prompt("Enter the link URL");
            if (url) pell.exec("createLink", this.ensureHTTP(url));
          },
        },
      ],
    });
  },
  created() {
    const html = document.documentElement; // returns the html tag
    html.setAttribute("lang", "en");
  },
  metaInfo() {
    return {
      title: "New blogpost",
      meta: [
        { name: "description", content: "New blogpost form" },
        { property: "og:title", content: "New blogpost" },
        { property: "og:site_name", content: "newblogpost" },
        { property: "og:type", content: "website" },
      ],
    };
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Heebo&display=swap");

body {
  background-color: #f2f2f2;
}

.blogpostform {
  max-width: 900px;
  margin: 3rem auto;
  font-family: "Heebo";

  h1 {
    padding-left: 50px;
    padding-bottom: 10px;
  }

  .blogpostfields {
    background-color: white;
    border-radius: 10px;

    .pell {
      padding-top: 2px;
      border-radius: 4px;
    }

    .output {
      padding: 15px 0px 20px 0px;
      margin-left: -55px;
      width: 800px;
      height: 52px;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .file {
      margin-bottom: 12px;
    }
  }
}
</style>
