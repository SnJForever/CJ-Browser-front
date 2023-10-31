import Note from "../store/modules/Note";
import store from "../store";

const { spawn } = require('child_process');
const brower = {
    runExternalExe(note) {
        // 用于运行外部程序的 .exe 文件路径
        // const keys = Object.keys(note.files);
        // const cleanedText = note.files[keys[0]].content.replace(/\\r\\n/g, '');
        // const escapedText = cleanedText.replace(/\(/g, '\\(').replace(/\)/g, '\\)');

        // const exePath = 'src\\brower\\main.exe';
        const exePath = process.cwd()+'\\resources\\browermain\\main.exe'

        // 运行外部程序
        const childProcess = spawn(exePath, [JSON.stringify(note.form)], {
          detached: true, // 可选，如果需要在后台运行
          stdio: 'ignore', // 可选，如果不希望子进程与主进程共享 stdio
        });
        
        // 添加错误处理
        childProcess.on('error', (err) => {
          console.error('Error:', err);
        });
    
        // 添加关闭处理
        childProcess.on('close', (code) => {
          
          console.log(childProcess.pid ,'子进程已退出，退出码：', code);
          const note_now = Note.state.notes.find(nt => nt._id === note._id);
          note_now.pid = "";
          note_now.updatedAt = new Date();
          Note.actions.updateNote(store,note_now);
        });
        return childProcess.pid
      }
};

export default brower;
