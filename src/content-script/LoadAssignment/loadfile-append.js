(function() {
    if (window.gradeAssignment) {
        var proxied = window.gradeAssignment.init;
        window.gradeAssignment.init = function() {
            // var fileUrl = "https://blackboard.unist.ac.kr"+JSON.parse(arguments[1]).downloadUrl
            var downloadBtns =  document.querySelectorAll('a[href*="webapps/assignment/download?"]');
            var fileUrl = [];
            downloadBtns.forEach(item => {
                var fileName = item.parentElement.parentElement.textContent.trim();
                var fileURL = item.href;
                fileUrl.push({"fileName":fileName, "fileURL": fileURL});
            }); // push fileURL to array
            var storage = {};
            storage = JSON.parse(localStorage.getItem('fileInfo')) || {};

            var temp = {};
            temp.content_id = new URL(document.URL).searchParams.get('content_id');
            temp.course_id = new URL(document.URL).searchParams.get('course_id');
            temp.last_update = new Date().toLocaleString();
            var content_info = `content_id=${temp.content_id}&course_id=${temp.arrcourse_id}`;
            temp.url = `https://blackboard.unist.ac.kr/webapps/assignment/uploadAssignment?${content_info}`;
            temp.fileUrl = [...new Set(fileUrl)]; // replace duplicate keys : https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
            if(jQuery('#aggregateGrade')[0].value != '-'){
                temp.score = jQuery('#aggregateGrade')[0].value;
                temp.totalscore = jQuery('#aggregateGrade')[0].next().textContent.replace('/',"");
            }
            var h3, p;
            Array.from(jQuery("#assignmentInfo")[0].children).forEach(item => {
                if(item.tagName == 'H3') {
                    h3 = item.textContent.replace(" ", "_");
                }
                if(item.tagName == 'P') {
                    p = item.textContent;
                    temp[h3] = p;
                }
                if(item.tagName == 'UL'){
                    var filelist = [];
                    Array.from(item.childNodes).forEach(child =>{
                        if(child.nodeType == 1) {
                            var fileURL = child.children[0].href;
                            var fileName = child.children[0].textContent.trim();
                            filelist.push({"fileName":fileName, "fileURL": fileURL});
                        }
                    })
                    temp[h3] = [...new Set(filelist)];
                }
            })
            storage[temp.content_id+"-"+temp.course_id] = temp;
            localStorage.setItem('fileInfo', JSON.stringify(storage));
            proxied.apply(this, [].slice.call(arguments));
        }

    }
})();