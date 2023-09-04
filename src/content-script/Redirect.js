// redirect bb.unist.ac.kr* to blackboard.unist.ac.kr*

//iife to run on page load
(()=>{
    window.location.href = window.location.href.replace("bb.unist.ac.kr", "blackboard.unist.ac.kr");
})();