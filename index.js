
const staticHTMLUrl = "https://static-links-page.signalnerve.workers.dev"

class BackgroundColor {
    constructor(color) {
        this.color = color
    }

    async element(element) {
        element.setAttribute("class", this.color)
    }
}

class TitleFixer {
    async element(element) {
        element.setInnerContent("Prathma Rastogi")
         
    }
}
class NameFixer {
    async element(element) {
        var elementId = element.getAttribute("id")

        if (elementId == "name") {
             element.setInnerContent("Prathma Rastogi")
         }
    }
}

class ImageFixer {
    async element(element) {
        var elementId = element.getAttribute("id")

        if (elementId == "avatar") {
             element.setAttribute("src", "https://cdn.iconscout.com/icon/free/png-512/cloudflare-285979.png")

         }
    }
}
class ProfileTransformer {
    async element(element) {
        const elId = element.getAttribute("id")
        if (elId == "profile") {
            element.removeAttribute("style")
        }
    }
}

class LinksTransformer {

    constructor(links) {
        this.links = links
    }

    async element(element) {
        const elTag = element.tagName

        var elementId = element.getAttribute("id")
        if (elementId == "links") {
            
                for (const link of this.links) {

                    const tag=`<a href= \"${link["url"]}\">${link["name"]}</a>`
                    
                    element.append(tag,{ html: true })
                }
            
        } else if (elementId == "social") {
            element.removeAttribute("style")
            for (const link of this.links) {

                    const tag=`<a href= \"${link["url"]}\"><svg width="50" height="50">${link["svg"]}</svg></a>`
                    
                    element.append(tag,{ html: true })
            }
        }
        
    }
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    console.log(`Received new request: ${request.url}`)

    const url = new URL(request.url)

    const data = [{"name":"Learn HTML", "url":"https://www.w3schools.com/html/html5_svg.asp"}, {"name":"Leetcode", "url":"https://leetcode.com/#"}, {"name":"github tutorial", "url":"https://kbroman.org/github_tutorial/pages/init.html"}]

    const svgLinks = [{"url":"https://simpleicons.org/", "svg":"<circle cx=\"50\" cy=\"50\" r=\"40\" stroke=\"green\" stroke-width=\"4\" fill=\"yellow\" />"}, {"url":"https://icons8.com/icons/set/svg", "svg":"<rect width=\"50\" height=\"50\" style=\"fill:rgb(0,0,255);stroke-width:10;stroke:rgb(0,0,0)\" />"}]

    if (url.pathname !== "/") {

        const init = {
            headers: { 'content-type': 'application/json' },
        }

        const body = JSON.stringify(data)
   
        return new Response(body, init)

    } else {
        const res = await fetch(staticHTMLUrl)
        return new HTMLRewriter().on("div#links", new LinksTransformer(data))
                                 .on("div#profile", new ProfileTransformer())
                                 .on("img#avatar", new ImageFixer())
                                 .on("h1#name", new NameFixer())
                                 .on("div#social", new LinksTransformer(svgLinks))
                                 .on("title", new TitleFixer())
                                 .on("body", new BackgroundColor("bg-red-800"))
                                .transform(res)
    }
}

