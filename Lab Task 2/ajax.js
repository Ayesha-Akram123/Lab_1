// URL for the fake API (you can use JSONPlaceholder as an example API)
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

// Handle form submission for creating a post
document.getElementById('createForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get values from form fields
    const title = document.getElementById('createTitle').value;
    const body = document.getElementById('createBody').value;

    // Perform POST request to create a new post
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body, userId: 1 })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post created:', data);
        addPostToUI(data); // Add the newly created post to the UI
        document.getElementById('createForm').reset(); // Clear the form after submission
    })
    .catch(error => console.error('Error creating post:', error));
});

// Function to add a post to the UI
function addPostToUI(post) {
    const postsList = document.getElementById('postsList');
    const postItem = document.createElement('div');
    postItem.className = 'card mb-3';
    postItem.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.body}</p>
            <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete</button>
            <button class="btn btn-warning" onclick="updatePost(${post.id})">Update</button>
        </div>
    `;
    postsList.appendChild(postItem);
}

// Fetch existing posts and display them when the page loads
window.onload = function() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => {
                addPostToUI(post);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
};

// Handle clearing the form inputs
document.getElementById('clearBtn').addEventListener('click', function() {
    document.getElementById('createForm').reset();
});

// Function to delete a post
function deletePost(postId) {
    fetch(`${apiUrl}/${postId}`, {
        method: 'DELETE'
    })
    .then(() => {
        console.log(`Post ${postId} deleted`);
        // Optionally, remove the post from the UI after deletion
        document.getElementById('postsList').innerHTML = '';
        // Reload the posts after deletion
        window.onload();
    })
    .catch(error => console.error('Error deleting post:', error));
}

// Function to update a post
function updatePost(postId) {
    const updatedTitle = prompt('Enter new title:');
    const updatedBody = prompt('Enter new body:');
    fetch(`${apiUrl}/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: updatedTitle,
            body: updatedBody,
            userId: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(`Post ${postId} updated`, data);
        // Optionally, refresh the posts list
        document.getElementById('postsList').innerHTML = '';
        window.onload();
    })
    .catch(error => console.error('Error updating post:', error));
}
