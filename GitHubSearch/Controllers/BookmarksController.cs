using System.Web.Mvc;

namespace GitHubSearch.Controllers
{
    public class BookmarksController : Controller
    {
        // Returns a JSON array of repository objects, retrieved from a string stored in Session
        public ActionResult Repos()
        {
            return Content((string)(Session["repos"]), "application/json");
        }

        // Stores a stringified JSON array of repository objects
        [HttpPost]
        public void Repos(string repos)
        {
            Session["repos"] = repos;
        }
    }
}