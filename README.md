# 👀 regard.rs

Regard is a self-hosted tool that allows you to track the amount of time you spend working on specific projects without any input from you. It consists of a command line interface (CLI) that allows you to manage your "watchers" (which are responsible for tracking whether you are working on a specific project). The CLI allows you to create, delete, or disable watchers, as well as check their status.

The graphical user interface (GUI) allows you to view your work times with precision, using graphs or a calendar, and also allows you to basic manage your watchers (enabling or disabling them).

![UmzJ1r8Z7D](https://user-images.githubusercontent.com/53370597/195318131-e1b3ad8b-4022-41c7-a226-3b9a28a1ee94.gif)


## 👨🏽‍💻 Installation


### 📊 GUI 

### ⌨️ CLI

### 🚮 Delete an element (but it is saved in the trash don't worry)

```sh
rmt [OPTION]... [FILE|FOLDER]...

Exemples: 
rmt text.txt
rmt * -- -text.txt
rmt folder test.txt *.sh
```
✨ I like to use **-f** option, to remove all the warnings.

### 📺 Launch CLI to restore or flush elements

```sh
rmt --td
```

### ❌ Flush all element from the trash
```sh
rmt --tf
```

### 🔎 Informations about the trash

```sh
rmt --ti
```

## 🔧 Using the configuration file

You can customize the behavior of the trash bin by editing the configuration file located at **~/.trash_rmt/config_rmt.yml**.

Currently, you have the option to encrypt your data so that it becomes unreadable from the trash. Compression is a feature that will be available in the future.

```yml
compression: false # not implemented yet
encryption: true
trash: null
```


## 🫵 Contribution

You can find all the information in the file [**CONTRIBUTING.md**](./CONTRIBUTING.md). Hoping to see you soon in my pull request 😊
