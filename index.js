var express = require('express');
var app = express();
var fs = require('fs');

// todo list
app.get('/todolist', function(req, res){
    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        console.log(data);
        res.send(data);
    });
})

// update todo list
app.put('/updateTask', function(req, res){
    var oldTaskName = req.query.oldTaskName.toString();
    var newTaskName = req.query.newTaskName.toString();
    function modifyJSON(oldTaskName, newTaskName) {
        fs.readFile('./db.json', function (err, taskList) {
            if (err) {
                return console.error(err);
            }
            var data = taskList.toString();
            data = JSON.parse(data);
            for (var i = 0; i < data.taskList.length; i++) {
                if (oldTaskName == data.taskList[i]) {
                    console.log(oldTaskName);
                    data.taskList[i] = newTaskName;
                    console.log(newTaskName);
                    console.log('change task')
                }
            }
            console.log(data.taskList);
            data.total = data.taskList.length;
            var str = JSON.stringify(data);

            fs.writeFile('./db.json', str, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Modify task in taskList...')
                res.send(data)
            })
        })
    }
    modifyJSON(oldTaskName, newTaskName)
})

app.delete('/deleteTask', function(req, res){
    var taskName = req.query.taskName.toString();

    function deleteJSON(taskName) {
        fs.readFile('./db.json', function (err, taskList) {
            if (err) {
                return console.error(err);
            }

            var data = taskList.toString();
            data = JSON.parse(data);

            for (var i = 0; i < data.taskList.length; i++) {
                if (taskName == data.taskList[i]) {
                    console.log(data.taskList[i])
                    data.taskList.splice(i, 1);
                    data.total = data.taskList.length;
                }
            }
            console.log(data.taskList);
            var str = JSON.stringify(data);

            fs.writeFile('./db.json', str, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('delete task in taskList...');
                res.send(data);
            })
        })
    }
    deleteJSON(taskName)
})

app.post('/addTask', function(req, res){
    var taskName = req.query.taskName
    function writeJSON(taskName) {
        // read json file
        fs.readFile('./db.json', function (err, taskList) {
            if (err) {
                return console.error(err);
            }
            var data = taskList.toString();
            data = JSON.parse(data);
            data.taskList.push(taskName);
            data.total = data.taskList.length;
            console.log(data.taskList);
            var str = JSON.stringify(data);
            fs.writeFile('./db.json', str, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Add new task to taskList...');
                res.send(data);
            })
        })
    }
    writeJSON(taskName)
})





var server = app.listen(8080, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at https://%s:%s", host, port)
})