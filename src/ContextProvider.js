import React, {useState, useEffect} from "react" 
import * as contentful from "contentful"

const Context = React.createContext()


function ContextProvider({children}) {

    const [posts, setPosts] = useState([])

    var client = contentful.createClient({
      space: '8h2joeckc394',
      accessToken: 'dIQ8tryIq-BA621gJKeUyecDfVRndSEjxsu_Cflzz08' })
  
    function getBlogEntries() { 
        console.log("im in getBlogEntries")  
        client.getEntries()
        .then(entries => storeBlogEntries(entries))
    }

    function storeBlogEntries(entries) {

        let allBlogEntries = []

        console.log("im in storeBlogEntries") 
        // console.log(entries.items.map(element => {return element}))

        allBlogEntries = entries.items.map(element => {return element})
        console.log("allBlogEntries array =")
        console.log(allBlogEntries)

        setPosts(allBlogEntries)
        console.log("this is posts")
        console.log(posts)
    }
    

    useEffect(() => {getBlogEntries()} ,[])

    return(
        <Context.Provider value="testvalue" >
            {children}
        </Context.Provider>
    )
}

export {Context, ContextProvider}