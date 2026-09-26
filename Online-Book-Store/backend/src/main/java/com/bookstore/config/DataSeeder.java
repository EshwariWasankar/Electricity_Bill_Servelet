package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Autowired
    public DataSeeder(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            System.out.println("🌱 Seeding initial book collection into MongoDB...");

            List<Book> initialBooks = List.of(
                new Book(
                    "The Pragmatic Programmer",
                    "Andy Hunt & Dave Thomas",
                    "Technology",
                    49.99,
                    4.9,
                    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
                    "Your journey to mastery in software craftmanship. Covers best practices, mindset, and practical patterns.",
                    "978-0135957059",
                    true
                ),
                new Book(
                    "Clean Code: A Handbook of Agile Software Craftsmanship",
                    "Robert C. Martin",
                    "Technology",
                    42.50,
                    4.8,
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                    "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
                    "978-0132350884",
                    true
                ),
                new Book(
                    "Dune",
                    "Frank Herbert",
                    "Sci-Fi",
                    24.99,
                    4.9,
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
                    "Set on the desert planet Arrakis, Dune is the story of Paul Atreides, heir to a noble family in a interstellar empire.",
                    "978-0441172719",
                    true
                ),
                new Book(
                    "Atomic Habits",
                    "James Clear",
                    "Self-Help",
                    21.00,
                    4.9,
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
                    "An easy & proven way to build good habits & break bad ones. Tiny changes, remarkable results.",
                    "978-0735211292",
                    true
                ),
                new Book(
                    "Sapiens: A Brief History of Humankind",
                    "Yuval Noah Harari",
                    "History",
                    29.99,
                    4.7,
                    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
                    "100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens.",
                    "978-0062316097",
                    true
                ),
                new Book(
                    "Designing Data-Intensive Applications",
                    "Martin Kleppmann",
                    "Technology",
                    54.99,
                    4.9,
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
                    "The definitive guide to architecture, data storage, scalability, and distributed systems design.",
                    "978-1449373320",
                    true
                ),
                new Book(
                    "Project Hail Mary",
                    "Andy Weir",
                    "Sci-Fi",
                    27.50,
                    4.8,
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
                    "A lone astronaut must save the earth from disaster in this incredible adventure from the author of The Martian.",
                    "978-0593135204",
                    true
                ),
                new Book(
                    "The Great Gatsby",
                    "F. Scott Fitzgerald",
                    "Fiction",
                    14.99,
                    4.6,
                    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
                    "A classic novel of the Jazz Age, detailing the mysterious Jay Gatsby and his unrequited love for Daisy Buchanan.",
                    "978-0743273565",
                    true
                )
            );

            bookRepository.saveAll(initialBooks);
            System.out.println("✅ Successfully seeded 8 books into MongoDB!");
        } else {
            System.out.println("ℹ️ MongoDB already contains " + bookRepository.count() + " books. Skipping initial seed.");
        }
    }
}
