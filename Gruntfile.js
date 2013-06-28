var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        watch: {
            files: ['*.jade'],
            options: {
                event: ['added', 'changed']
            }
        }
    });
    
    grunt.event.on('watch', function(action, filepath, target) {
        var cmd = 'jade -P ' + filepath;
        
        exec(cmd, function(err, stdout, stderr){
            if (err) console.log(err);
            
            console.log(stdout);
        });
    });
    
    grunt.registerTask('default', ['watch']);
};
