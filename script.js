async function fetchComments(page) {
  const response = await fetch(`https://bjapi.afreecatv.com/api/moolchoco/title/126972041/comment?page=${page}`);
  const data = await response.json();
  return data;
}

async function getAllComments() {
  let data = await fetchComments(1);

  const totalComments = data.comment_count;
  document.getElementById('totalComments').innerText = `총 댓글 수: ${totalComments}`;

  const totalPages = data.meta.last_page;

  let allComments = extractData(data.data);
  for (let page = 2; page <= totalPages; page++) {
    data = await fetchComments(page);
    allComments = allComments.concat(extractData(data.data));
  }

  allComments.sort((a, b) => b.like_cnt - a.like_cnt);

  displayComments(allComments);
}

function extractData(data) {
  return data.map(item => {
    const splitComments = item.comment.split('/');
    let secondComment = '';
    if (splitComments.length > 1) {
      const secondComments = splitComments[1].trim();
      const splitSecondComments = secondComments.split(' ')[0];
      secondComment = splitSecondComments
        .replace(/\n.*/, '')
        .replace(/\n.*/, '')
        .replace(/\n.*/, '')
        .replace(/\n.*/, '')
        .trim();
    }
    return {
      user_nick: item.user_nick,
      user_id: item.user_id,
      comment: splitComments[0].trim(),
      like_cnt: item.like_cnt,
      second_comment: secondComment,
    };
  });
}

function displayComments(comments) {
  let table = `<table>
        <tr>
            <th>순위</th>
            <th>방송</th>
            <th>마크</th>
            <th>UP순</th>
        </tr>`;

  comments.forEach((comment, index) => {
    table += `<tr>
            <td>${index + 1}</td>
            <td>${comment.user_nick}(${comment.user_id})</td>
            <td>${comment.comment}(${comment.second_comment})</td>
            <td>${comment.like_cnt}</td>
        </tr>`;
  });
  table += `</table>`;

  document.getElementById('commentsTable').innerHTML = table;
}
getAllComments();