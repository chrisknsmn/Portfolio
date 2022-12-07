const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            // entry.target.classList.remove('show');
        }
    });
});
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

function check() {
    document.getElementById('touch').checked = false;
    document.getElementById('drop-btn').style.transform = 'rotate(0deg)';
}
function dropdown() {
    if(document.getElementById('touch').checked == true) {
        document.getElementById('drop-btn').style.transform = 'rotate(90deg)';
    } else {
        document.getElementById('drop-btn').style.transform = 'rotate(0deg)';
    }
}
function scrollToTarget(id,offset){
    check();
    console.log(offset);
    var element = document.getElementById(id);
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}