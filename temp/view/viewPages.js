

const viewPages = {
    login: () => {
        return `
        
        <div class="container mx-auto flex justify-center p-0 my-5">
   <div class="w-full md:w-1/2">
    <h2 class="text-2xl font-bold text-center">Login</h2>
    <form action="/dashboard/login" method="POST" class="flex flex-col items-center text-center mt-4">
        <input type="email" name="email" id="" class="mt-3 p-2 border border-gray-300 rounded" placeholder="Enter email">
        <input type="password" name="password" class="mt-3 p-2 border border-gray-300 rounded" placeholder="Enter password">
        <button class="bg-blue-500 text-white py-2 px-4 rounded mt-3">Login</button>
    </form>
   </div>
</div>

`
    }
}

export default viewPages