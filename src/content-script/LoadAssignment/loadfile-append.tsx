export default {};
// interface Window {
//     gradeAssignment: {
//       init: () => void;
//     };
//   }
// declare const jQuery: any;
// interface Assignment {
// 	course_code?: string;
// 	content_id: string;
// 	course_id: string;
// 	engName?: string;
// 	last_update: string;
// 	url: string;
// 	fileUrl: FileUrl[];
// 	score: string;
// 	totalscore: string;
// 	Name: string;
// 	Due_Date: string;
// 	Assignment_Files: FileUrl[];
// }
// interface FileUrl {
// 	fileName: string;
// 	fileURL: string;
// }
// interface AssignmentList {
// 	[key: string]: Assignment;
// }
// (function() {
//     if (window.gradeAssignment) {
//       const proxied = window.gradeAssignment.init;
//       window.gradeAssignment.init = () => {
//         console.log('init');
//         const downloadBtns = document.querySelectorAll<HTMLAnchorElement>('a[href*="webapps/assignment/download?"]');
//         const fileUrl = Array.from(downloadBtns).map((item) => ({
//           fileName: item.parentElement!.parentElement!.textContent!.trim(),
//           fileURL: item.href,
//         }));
//         let storage: AssignmentList = {};
//         const storedData = localStorage.getItem('fileInfo');
//         if (storedData) {
//         storage = JSON.parse(storedData);
//         }
//         const content_id = new URL(document.URL).searchParams.get('content_id');
//         const course_id = new URL(document.URL).searchParams.get('course_id')
//         const temp: Assignment = {
//           content_id: content_id!,
//           course_id: course_id!,
//           last_update: new Date().toLocaleString(),
//           url: `https://blackboard.unist.ac.kr/webapps/assignment/uploadAssignment?content_id=${content_id}&course_id=${course_id}`,
//           fileUrl: [...new Set(fileUrl)],
//           score: '',
//           totalscore: '',
//           Name: '',
//           Due_Date: '',
//           Assignment_Files: [],
//         };
  
//         const aggregateGrade = jQuery('#aggregateGrade')[0];
//         if (aggregateGrade.value !== '-') {
//           temp.score = aggregateGrade.value;
//           temp.totalscore = aggregateGrade.nextElementSibling!.textContent!.replace('/', '');
//         }
  
//         let h3: string | undefined;
//         let assignmentInfo = jQuery('#assignmentInfo')[0].children;
//         Array.from(jQuery('#assignmentInfo')[0].children).forEach((item:any) => {
          
//           if (item.tagName === 'H3') {
//             h3 = item.textContent!.replace(' ', '_');
//           } else if (item.tagName === 'P') {
//             if(h3 === 'Name' || h3 === 'Due_Date') {
//                 temp[h3!] = item.textContent;
//             }
//           } else if (item.tagName === 'UL') {
//             const filelist: FileUrl[] = Array.from(item.children)
//       .filter((child): child is HTMLElement => (child as any).nodeType === 1)
//       .map((child) => ({
//         fileName: (child.children[0] as HTMLAnchorElement).textContent!.trim(),
//         fileURL: (child.children[0] as HTMLAnchorElement).href,
//       }));
//             if(h3 === 'Assignment_Files') {
//                 temp[h3!] = [...new Set(filelist)];
//             }
//           }
//         });
  
//         storage[`${temp.content_id}-${temp.course_id}`] = temp;
//         localStorage.setItem('fileInfo', JSON.stringify(storage));
//         new BroadcastChannel('fileInfo').postMessage(JSON.stringify(storage));
//         proxied.apply(this, [].slice.call(arguments));
//       };
//     }
//   })();